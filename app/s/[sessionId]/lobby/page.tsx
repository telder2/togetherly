'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Loader2, Play, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemberAvatar } from '@/components/member-avatar';
import { supabase } from '@/lib/supabase/client';
import { useIdentityStore } from '@/store';
import { THEMES } from '@/lib/types';
import type { Session, GroupMember } from '@/lib/types';
import { toast } from 'sonner';
import Link from 'next/link';

export default function Lobby() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const getIdentity = useIdentityStore((s) => s.getIdentity);

  const [session, setSession] = useState<Session | null>(null);
  const [participants, setParticipants] = useState<GroupMember[]>([]);
  const [allGroupMembers, setAllGroupMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [joining, setJoining] = useState(false);
  const [identity, setIdentityState] = useState<ReturnType<typeof getIdentity>>(null);

  const loadSession = useCallback(async () => {
    const { data: s } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', params.sessionId)
      .single();

    if (!s) { router.push('/'); return; }

    if (s.status === 'playing') { router.push(`/s/${s.id}/play`); return; }
    if (s.status === 'revealed' || s.status === 'ended') { router.push(`/s/${s.id}/reveal`); return; }

    setSession(s);

    const id = getIdentity(s.group_id);
    setIdentityState(id);

    // Load participants with their member data
    const { data: participantRows } = await supabase
      .from('session_participants')
      .select('member_id')
      .eq('session_id', s.id);

    const participantIds = (participantRows ?? []).map((p: { member_id: string }) => p.member_id);

    const { data: members } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', s.group_id)
      .order('joined_at');

    const allMembers = members ?? [];
    setAllGroupMembers(allMembers);
    setParticipants(allMembers.filter((m: GroupMember) => participantIds.includes(m.id)));
    setLoading(false);
  }, [params.sessionId, router, getIdentity]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Realtime: session status changes
  useEffect(() => {
    const channel = supabase
      .channel(`session-${params.sessionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${params.sessionId}` },
        (payload) => {
          const updated = payload.new as Session;
          if (updated.status === 'playing') { router.push(`/s/${updated.id}/play`); return; }
          if (updated.status === 'revealed') { router.push(`/s/${updated.id}/reveal`); return; }
          setSession(updated);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [params.sessionId, router]);

  // Realtime: participants joining the session
  useEffect(() => {
    const sid = session?.id;
    if (!sid) return;
    const channel = supabase
      .channel(`lobby-participants-${sid}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_participants', filter: `session_id=eq.${sid}` },
        () => loadSession()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session?.id, loadSession]);

  // Realtime: people joining the group itself (creating new identities). Without
  // this the lobby only re-fetches when session_participants changes — so a
  // brand-new group member doesn't appear in the "not yet joined" list until refresh.
  useEffect(() => {
    const gid = session?.group_id;
    if (!gid) return;
    const channel = supabase
      .channel(`lobby-group-members-${gid}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members', filter: `group_id=eq.${gid}` },
        () => loadSession()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session?.group_id, loadSession]);

  const joinSession = async () => {
    if (!identity || !session) return;
    setJoining(true);
    try {
      await supabase.from('session_participants').insert({
        session_id: session.id,
        member_id: identity.memberId,
      });
    } catch {
      toast.error('Failed to join session.');
    } finally {
      setJoining(false);
    }
  };

  const startGame = async () => {
    if (!session) return;
    setStarting(true);
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: 'playing' })
        .eq('id', session.id);
      if (error) throw error;
    } catch {
      toast.error('Failed to start game.');
      setStarting(false);
    }
  };

  const isHost = identity?.memberId === session?.host_member_id;
  const isParticipant = participants.some((p) => p.id === identity?.memberId);
  const theme = THEMES.find((t) => t.id === session?.theme);
  const canStart = isHost && participants.length >= 2;

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen px-4 py-8 max-w-sm mx-auto gap-6">
      {/* Back */}
      {identity && (
        <Link href={`/g/${identity.groupCode}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Group home
        </Link>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{theme?.emoji}</span>
          <div>
            <h1 className="font-display text-2xl font-bold">{theme?.label}</h1>
            <p className="text-sm text-muted-foreground capitalize">{session?.mode} mode · Waiting for players</p>
          </div>
        </div>
      </motion.div>

      {/* Waiting pulsing indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme?.accent }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: theme?.accent }} />
        </span>
        Lobby open — share your group code to let people join
      </div>

      {/* Participants */}
      <section className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          In the room · {participants.length} / {allGroupMembers.length}
        </p>
        <motion.div layout className="flex flex-wrap gap-3">
          <AnimatePresence>
            {participants.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <MemberAvatar seed={m.avatar_seed} name={m.name} size="md" showName />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Group members not yet joined */}
      {allGroupMembers.filter((m) => !participants.some((p) => p.id === m.id)).length > 0 && (
        <section className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Not yet joined</p>
          <div className="flex flex-wrap gap-3">
            {allGroupMembers
              .filter((m) => !participants.some((p) => p.id === m.id))
              .map((m) => (
                <MemberAvatar key={m.id} seed={m.avatar_seed} name={m.name} size="md" showName className="opacity-30" />
              ))}
          </div>
        </section>
      )}

      <div className="flex-1" />

      {/* CTA */}
      <div className="space-y-3">
        {!isParticipant && identity && (
          <Button
            onClick={joinSession}
            disabled={joining}
            variant="outline"
            className="w-full h-12 text-base rounded-xl border-white/15"
          >
            {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join this session'}
          </Button>
        )}

        {isHost && (
          <Button
            onClick={startGame}
            disabled={!canStart || starting}
            className="w-full h-14 text-base font-semibold rounded-xl"
            style={canStart ? { background: `linear-gradient(135deg, ${theme?.accent}, ${theme?.accent}99)` } : {}}
          >
            {starting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {canStart ? `Start game · ${participants.length} players` : `Need at least 2 players (${participants.length} joined)`}
              </>
            )}
          </Button>
        )}

        {!isHost && isParticipant && (
          <p className="text-center text-sm text-muted-foreground">
            Waiting for the host to start…
          </p>
        )}
      </div>
    </main>
  );
}
