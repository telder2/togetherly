'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RevealParty } from '@/components/reveal-party';
import { RevealFamily } from '@/components/reveal-family';
import { supabase } from '@/lib/supabase/client';
import { useIdentityStore } from '@/store';
import { computePairwiseSimilarity, computeFamilyPairwiseSimilarity, getRankings } from '@/lib/similarity';
import { getQuestionsByTheme, getQuestionsByCategory } from '@/lib/questions';
import { THEMES } from '@/lib/types';
import type { Session, GroupMember, Answer, SimilarityResult } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function Reveal() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const getIdentity = useIdentityStore((s) => s.getIdentity);

  const [session, setSession] = useState<Session | null>(null);
  const [rankings, setRankings] = useState<SimilarityResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupCode, setGroupCode] = useState('');

  const compute = useCallback(async () => {
    const { data: s } = await supabase.from('sessions').select('*').eq('id', params.sessionId).single();
    if (!s) { router.push('/'); return; }
    setSession(s);

    const id = getIdentity(s.group_id);
    if (!id) { router.push('/'); return; }

    const { data: group } = await supabase.from('groups').select('code').eq('id', s.group_id).single();
    if (group) setGroupCode(group.code);

    // Fetch all participants
    const { data: participantRows } = await supabase
      .from('session_participants')
      .select('member_id')
      .eq('session_id', s.id);

    const participantIds = (participantRows ?? []).map((p: { member_id: string }) => p.member_id);

    const { data: members } = await supabase
      .from('group_members')
      .select('*')
      .in('id', participantIds);

    // Fetch all answers (pass 1)
    const { data: answerRows } = await supabase
      .from('answers')
      .select('*')
      .eq('session_id', s.id)
      .is('target_member_id', null);

    const memberAnswers: Record<string, Answer[]> = {};
    for (const a of (answerRows ?? []) as Answer[]) {
      if (!memberAnswers[a.member_id]) memberAnswers[a.member_id] = [];
      memberAnswers[a.member_id].push(a);
    }

    const allMembers = (members ?? []) as GroupMember[];
    const questions = getQuestionsByTheme(s.theme);
    const questionIds = questions.map((q) => q.id);

    let pairwiseMatrix: ReturnType<typeof computePairwiseSimilarity>;
    let categoryMatrices: Record<string, ReturnType<typeof computePairwiseSimilarity>> | undefined;

    if (s.mode === 'family') {
      const byCategory = getQuestionsByCategory(s.theme);
      const catIds: Record<string, string[]> = {};
      for (const [cat, qs] of Object.entries(byCategory)) {
        catIds[cat] = qs.map((q) => q.id);
      }
      const { overall, byCategory: byCat } = computeFamilyPairwiseSimilarity(memberAnswers, catIds);
      pairwiseMatrix = overall;
      categoryMatrices = byCat;
    } else {
      pairwiseMatrix = computePairwiseSimilarity(memberAnswers, questionIds);
    }

    const ranked = getRankings(id.memberId, pairwiseMatrix, allMembers);

    if (categoryMatrices) {
      const withCats = ranked.map((r) => ({
        ...r,
        byCategory: Object.fromEntries(
          Object.entries(categoryMatrices!).map(([cat, m]) => [cat, m[id.memberId]?.[r.memberId] ?? 0])
        ),
      }));
      setRankings(withCats);
    } else {
      setRankings(ranked);
    }

    // Persist results if we're host and they aren't saved yet
    if (id.memberId === s.host_member_id && !s.session_results) {
      await supabase
        .from('sessions')
        .update({ session_results: pairwiseMatrix })
        .eq('id', s.id);
    }

    setLoading(false);
  }, [params.sessionId, router, getIdentity]);

  useEffect(() => { compute(); }, [compute]);

  const theme = session ? THEMES.find((t) => t.id === session.theme) : null;
  const accent = theme?.accent ?? '#7c3aed';
  const identity = session ? getIdentity(session.group_id) : null;

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Crunching the numbers…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen py-8 gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-4 max-w-sm mx-auto w-full"
      >
        <span className="text-2xl">{theme?.emoji}</span>
        <div>
          <h1 className="font-display text-xl font-bold">{theme?.label} results</h1>
          <p className="text-xs text-muted-foreground">{session?.mode} mode</p>
        </div>
      </motion.div>

      {/* Reveal content */}
      {session?.mode === 'party' ? (
        <RevealParty myMemberId={identity?.memberId ?? ''} rankings={rankings} accent={accent} />
      ) : (
        <RevealFamily myMemberId={identity?.memberId ?? ''} rankings={rankings} accent={accent} />
      )}

      {/* Back to group */}
      {groupCode && (
        <div className="px-4 max-w-sm mx-auto w-full">
          <Link href={`/g/${groupCode}`}>
            <Button variant="outline" className="w-full h-12 rounded-xl border-white/15">
              ← Back to group
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}
