'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MemberAvatar } from '@/components/member-avatar';
import { supabase } from '@/lib/supabase/client';
import { generateAvatarSeed } from '@/lib/avatar';
import { useIdentityStore } from '@/store';
import { toast } from 'sonner';
import type { Group, GroupMember } from '@/lib/types';

function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('togetherly-device-id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('togetherly-device-id', id);
  }
  return id;
}

export default function JoinGroupIdentity() {
  const router = useRouter();
  const params = useParams<{ code: string }>();
  const setIdentity = useIdentityStore((s) => s.setIdentity);
  const getIdentity = useIdentityStore((s) => s.getIdentity);

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'pick' | 'new'>('new');
  const [newName, setNewName] = useState('');
  const [avatarSeed] = useState(generateAvatarSeed);

  useEffect(() => {
    const load = async () => {
      const { data: g } = await supabase
        .from('groups')
        .select('*')
        .eq('code', params.code)
        .single();

      if (!g) { router.push('/join'); return; }

      // Check if already have identity for this group
      const existing = getIdentity(g.id);
      if (existing) {
        router.push(`/g/${g.code}`);
        return;
      }

      const { data: ms } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', g.id)
        .order('joined_at', { ascending: true });

      setGroup(g);
      setMembers(ms ?? []);
      if ((ms ?? []).length > 0) setMode('pick');
      setLoading(false);
    };
    load();
  }, [params.code, router, getIdentity]);

  const claimMember = async (member: GroupMember) => {
    if (!group) return;
    setSaving(true);
    try {
      await supabase
        .from('group_members')
        .update({ device_id: getDeviceId() })
        .eq('id', member.id);

      setIdentity(group.id, {
        groupId: group.id,
        groupCode: group.code,
        groupName: group.name,
        memberId: member.id,
        memberName: member.name,
        avatarSeed: member.avatar_seed,
        role: member.role,
      });
      router.push(`/g/${group.code}`);
    } catch {
      toast.error('Failed to claim identity.');
    } finally {
      setSaving(false);
    }
  };

  const createMember = async () => {
    if (!group || !newName.trim()) return;
    setSaving(true);
    try {
      const { data: member, error } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          name: newName.trim(),
          avatar_seed: avatarSeed,
          role: 'member',
          device_id: getDeviceId(),
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('That name is already taken in this group.');
        } else {
          throw error;
        }
        return;
      }

      setIdentity(group.id, {
        groupId: group.id,
        groupCode: group.code,
        groupName: group.name,
        memberId: member.id,
        memberName: member.name,
        avatarSeed: member.avatar_seed,
        role: 'member',
      });
      router.push(`/g/${group.code}`);
    } catch {
      toast.error('Failed to join group.');
    } finally {
      setSaving(false);
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
    <main className="flex flex-col items-center min-h-screen px-4 py-8 gap-8">
      <div className="w-full max-w-sm">
        <Link href="/join" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Joining</p>
          <h1 className="font-display text-3xl font-bold">{group?.name}</h1>
        </div>

        {members.length > 0 && (
          <div className="flex gap-2 border border-white/8 rounded-xl p-1">
            <button
              onClick={() => setMode('pick')}
              className={`flex-1 text-sm py-2 rounded-lg transition-colors font-medium ${mode === 'pick' ? 'bg-white/10 text-foreground' : 'text-muted-foreground'}`}
            >
              Pick my identity
            </button>
            <button
              onClick={() => setMode('new')}
              className={`flex-1 text-sm py-2 rounded-lg transition-colors font-medium ${mode === 'new' ? 'bg-white/10 text-foreground' : 'text-muted-foreground'}`}
            >
              I&apos;m new here
            </button>
          </div>
        )}

        {mode === 'pick' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Who are you?</p>
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => claimMember(m)}
                disabled={saving}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-card hover:bg-white/5 transition-colors text-left"
              >
                <MemberAvatar seed={m.avatar_seed} size="md" />
                <span className="font-medium">{m.name}</span>
              </button>
            ))}
          </div>
        )}

        {mode === 'new' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Your name in this group</Label>
              <div className="flex items-center gap-3">
                <MemberAvatar seed={avatarSeed} size="md" />
                <Input
                  id="new-name"
                  placeholder="Your name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-14 text-base flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && createMember()}
                />
              </div>
            </div>

            <Button
              onClick={createMember}
              disabled={!newName.trim() || saving}
              className="w-full h-14 text-base font-semibold rounded-xl"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join group →'}
            </Button>
          </div>
        )}
      </motion.div>
    </main>
  );
}
