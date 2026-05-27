'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Copy, Check, Loader2, Plus, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemberAvatar } from '@/components/member-avatar';
import { StartSessionModal } from '@/components/start-session-modal';
import { supabase } from '@/lib/supabase/client';
import { useIdentityStore } from '@/store';
import { THEMES } from '@/lib/types';
import type { Group, GroupMember, Session } from '@/lib/types';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatDistanceToNow } from './time-utils';

export default function GroupHome() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const getIdentity = useIdentityStore((s) => s.getIdentity);

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [pastSessions, setPastSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [identity, setIdentityState] = useState<ReturnType<typeof getIdentity>>(null);
  const [copied, setCopied] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const loadGroup = useCallback(async () => {
    const { data: g } = await supabase
      .from('groups')
      .select('*')
      .eq('code', params.code)
      .single();

    if (!g) { router.push('/'); return; }
    setGroup(g);

    const id = getIdentity(g.id);
    setIdentityState(id);

    if (!id) {
      router.push(`/g/${g.code}/join`);
      return;
    }

    const [{ data: ms }, { data: sessions }] = await Promise.all([
      supabase.from('group_members').select('*').eq('group_id', g.id).order('joined_at'),
      supabase.from('sessions').select('*').eq('group_id', g.id).order('created_at', { ascending: false }),
    ]);

    setMembers(ms ?? []);
    const allSessions = sessions ?? [];
    setActiveSessions(allSessions.filter((s) => s.status === 'lobby' || s.status === 'playing'));
    setPastSessions(allSessions.filter((s) => s.status === 'revealed' || s.status === 'ended').slice(0, 5));
    setLoading(false);
  }, [params.code, router, getIdentity]);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  // Realtime: members list
  useEffect(() => {
    if (!group) return;
    const channel = supabase
      .channel(`group-members-${group.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members', filter: `group_id=eq.${group.id}` },
        () => loadGroup()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [group, loadGroup]);

  // Realtime: sessions (for live session banner)
  useEffect(() => {
    if (!group) return;
    const channel = supabase
      .channel(`group-sessions-${group.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions', filter: `group_id=eq.${group.id}` },
        () => loadGroup()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [group, loadGroup]);

  const copyCode = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareGroup = async () => {
    if (!group) return;
    const url = `${window.location.origin}/g/${group.code}/join`;
    if (navigator.share) {
      await navigator.share({ title: group.name, text: `Join my group on Togetherly! Code: ${group.code}`, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Invite link copied!');
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen px-4 py-8 max-w-sm mx-auto gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="font-display text-3xl font-bold">{group?.name}</h1>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono text-muted-foreground">{group?.code}</code>
          <button onClick={copyCode} className="text-muted-foreground hover:text-foreground transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button onClick={shareGroup} className="text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Live session banners */}
      <AnimatePresence>
        {activeSessions.map((session) => {
          const theme = THEMES.find((t) => t.id === session.theme);
          const isPlaying = session.status === 'playing';
          // Adult mode keeps the theme secret while the round is live.
          const hideTheme = !!theme?.hidden;
          const bannerAccent = hideTheme ? '#dc2626' : (theme?.accent ?? '#7c3aed');
          const bannerEmoji = hideTheme ? '🔞' : (theme?.emoji ?? '🎮');
          const bannerLabel = hideTheme ? 'Mystery Round · 18+' : `${theme?.label} · ${session.mode}`;
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <Link href={`/s/${session.id}/lobby`}>
                <div
                  className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
                  style={{ backgroundColor: bannerAccent + '22', border: `1px solid ${bannerAccent}44` }}
                >
                  <span className="text-2xl">{bannerEmoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: bannerAccent }}>
                      {isPlaying ? 'Game in progress' : 'Lobby open'}
                    </p>
                    <p className="text-xs text-muted-foreground">{bannerLabel}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Members */}
      <section className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Members · {members.length}</p>
        <motion.div layout className="flex flex-wrap gap-3">
          <AnimatePresence>
            {members.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <MemberAvatar
                  seed={m.avatar_seed}
                  name={m.name}
                  size="md"
                  showName
                  className={m.id === identity?.memberId ? 'opacity-100' : 'opacity-70'}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Start session */}
      <Button
        onClick={() => setShowSessionModal(true)}
        className="w-full h-14 text-base font-semibold rounded-xl"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Start a session
      </Button>

      {/* Session history */}
      {pastSessions.length > 0 && (
        <section className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">History</p>
          <div className="space-y-2">
            {pastSessions.map((session) => {
              const theme = THEMES.find((t) => t.id === session.theme);
              const results = session.session_results as Record<string, unknown> | null;
              return (
                <Link key={session.id} href={`/s/${session.id}/reveal`}>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-card hover:bg-white/5 transition-colors">
                    <span className="text-xl">{theme?.emoji ?? '🎮'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{theme?.label ?? session.theme}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.revealed_at ? formatDistanceToNow(new Date(session.revealed_at)) : 'Ended'}
                      </p>
                    </div>
                    {results && (
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <StartSessionModal
        open={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        group={group!}
        identity={identity}
      />
    </main>
  );
}
