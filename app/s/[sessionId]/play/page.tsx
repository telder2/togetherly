'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/question-card';
import { supabase } from '@/lib/supabase/client';
import { useIdentityStore } from '@/store';
import { getQuestionsByTheme } from '@/lib/questions';
import { THEMES } from '@/lib/types';
import type { Session, Question, Answer } from '@/lib/types';
import { toast } from 'sonner';
import Link from 'next/link';

export default function Play() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const getIdentity = useIdentityStore((s) => s.getIdentity);

  const [session, setSession] = useState<Session | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [done, setDone] = useState(false);

  const identity = session ? getIdentity(session.group_id) : null;
  const theme = session ? THEMES.find((t) => t.id === session.theme) : null;
  const accent = theme?.accent ?? '#7c3aed';

  const loadSession = useCallback(async () => {
    const { data: s } = await supabase.from('sessions').select('*').eq('id', params.sessionId).single();
    if (!s) { router.push('/'); return; }
    if (s.status === 'revealed') { router.push(`/s/${s.id}/reveal`); return; }
    if (s.status === 'lobby') { router.push(`/s/${s.id}/lobby`); return; }

    setSession(s);
    const qs = getQuestionsByTheme(s.theme);
    setQuestions(qs);

    const id = getIdentity(s.group_id);

    // Load existing answers
    if (id) {
      const { data: myAnswers } = await supabase
        .from('answers')
        .select('*')
        .eq('session_id', s.id)
        .eq('member_id', id.memberId)
        .is('target_member_id', null);

      const answerMap: Record<string, number> = {};
      (myAnswers ?? []).forEach((a: Answer) => { answerMap[a.question_id] = a.value; });
      setAnswers(answerMap);

      if (Object.keys(answerMap).length === qs.length) {
        setDone(true);
      }
    }

    // Count unique members with all answers
    const { data: countRows } = await supabase
      .from('answers')
      .select('member_id')
      .eq('session_id', s.id)
      .is('target_member_id', null);

    const uniqMembers = new Set((countRows ?? []).map((r: { member_id: string }) => r.member_id));
    setTotalAnswered(uniqMembers.size);

    const { count } = await supabase
      .from('session_participants')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', s.id);
    setTotalParticipants(count ?? 0);

    setLoading(false);
  }, [params.sessionId, router, getIdentity]);

  useEffect(() => { loadSession(); }, [loadSession]);

  // Realtime: watch for all-answered → trigger reveal
  useEffect(() => {
    const channel = supabase
      .channel(`play-answers-${params.sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'answers', filter: `session_id=eq.${params.sessionId}` },
        () => loadSession()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [params.sessionId, loadSession]);

  useEffect(() => {
    const channel = supabase
      .channel(`play-session-${params.sessionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${params.sessionId}` },
        (payload) => {
          const updated = payload.new as Session;
          if (updated.status === 'revealed') { router.push(`/s/${updated.id}/reveal`); }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [params.sessionId, router]);

  // Safety net: while waiting on the "all done" screen, poll session status every 4s
  // in case a realtime UPDATE event was missed (network blip, subscription drop).
  useEffect(() => {
    if (!done) return;
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('sessions')
        .select('status')
        .eq('id', params.sessionId)
        .single();
      if (data?.status === 'revealed') {
        router.push(`/s/${params.sessionId}/reveal`);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [done, params.sessionId, router]);

  const saveAnswer = async (questionId: string, value: number) => {
    if (!identity || !session) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    const { error } = await supabase.from('answers').upsert({
      session_id: session.id,
      member_id: identity.memberId,
      question_id: questionId,
      value,
      target_member_id: null,
    }, { onConflict: 'session_id,member_id,question_id,target_member_id' });

    if (error) {
      console.error(error);
      toast.error('Failed to save answer.');
    }
  };

  const submitAllAnswers = async () => {
    if (!identity || !session) return;
    setSubmitting(true);
    try {
      // Upsert all answers at once
      const rows = questions.map((q) => ({
        session_id: session.id,
        member_id: identity.memberId,
        question_id: q.id,
        value: answers[q.id] ?? 2,
        target_member_id: null,
      }));
      await supabase.from('answers').upsert(rows, { onConflict: 'session_id,member_id,question_id,target_member_id' });
      setDone(true);

      // Check if everyone is done and we're the host
      const { data: participantRows } = await supabase
        .from('session_participants')
        .select('member_id')
        .eq('session_id', session.id);

      const { data: answeredRows } = await supabase
        .from('answers')
        .select('member_id')
        .eq('session_id', session.id)
        .is('target_member_id', null);

      const participantIds = new Set((participantRows ?? []).map((p: { member_id: string }) => p.member_id));
      const answeredIds = new Set((answeredRows ?? []).map((a: { member_id: string }) => a.member_id));
      const allDone = [...participantIds].every((id) => answeredIds.has(id));

      // Any player (not just host) can trigger the transition. The DB trigger also handles this
      // server-side as a safety net. Conditional update prevents double-trigger races.
      if (allDone) {
        await supabase
          .from('sessions')
          .update({ status: 'revealed', revealed_at: new Date().toISOString() })
          .eq('id', session.id)
          .eq('status', 'playing');
        // No router.push here — the realtime subscription will redirect everyone
      }
    } catch {
      toast.error('Failed to submit answers.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIdx];
  const currentValue = currentQuestion ? (answers[currentQuestion.id] ?? null) : null;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  if (loading) {
    return <main className="flex items-center justify-center min-h-screen"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></main>;
  }

  if (done) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen px-4 gap-6 max-w-sm mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: accent + '22' }}>
            <Check className="w-10 h-10" style={{ color: accent }} />
          </div>
          <h1 className="font-display text-2xl font-bold">All done!</h1>
          <p className="text-muted-foreground">
            {totalAnswered} of {totalParticipants} players have finished.
          </p>
          <p className="text-sm text-muted-foreground">Waiting for everyone else…</p>
          <div className="flex gap-1 justify-center">
            {Array.from({ length: totalParticipants }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i < totalAnswered ? accent : 'rgb(255 255 255 / 0.15)' }} />
            ))}
          </div>
        </motion.div>
        {identity && (
          <Link href={`/g/${identity.groupCode}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to group
          </Link>
        )}
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen px-4 py-8 max-w-sm mx-auto gap-6">
      {/* Top nav */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {identity ? (
          <Link href={`/g/${identity.groupCode}`} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
            ← {identity.groupName}
          </Link>
        ) : <span />}
        <span style={{ color: accent }}>{theme?.emoji} {theme?.label}</span>
        <span>{totalAnswered}/{totalParticipants} done</span>
      </div>

      <AnimatePresence mode="wait">
        {currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            value={currentValue}
            onChange={(v) => {
              // Save in the background — don't auto-advance. User picks lean
              // intensity and then taps "Next →" explicitly.
              saveAnswer(currentQuestion.id, v);
            }}
            accent={accent}
            questionNumber={currentIdx + 1}
            totalQuestions={questions.length}
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 mt-auto">
        {currentIdx > 0 && (
          <Button variant="outline" onClick={() => setCurrentIdx((i) => i - 1)} className="h-12 rounded-xl border-white/15">
            ← Back
          </Button>
        )}
        {currentIdx < questions.length - 1 ? (
          <Button
            onClick={() => setCurrentIdx((i) => i + 1)}
            disabled={!currentValue}
            className="flex-1 h-12 rounded-xl"
            style={currentValue ? { backgroundColor: accent } : {}}
          >
            Next →
          </Button>
        ) : (
          <Button
            onClick={submitAllAnswers}
            disabled={!allAnswered || submitting}
            className="flex-1 h-12 rounded-xl font-semibold"
            style={allAnswered ? { backgroundColor: accent } : {}}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit answers →'}
          </Button>
        )}
      </div>
    </main>
  );
}
