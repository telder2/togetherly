'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MemberAvatar } from '@/components/member-avatar';
import { supabase } from '@/lib/supabase/client';
import { generateGroupCode, generateSessionCode } from '@/lib/codes';
import { generateAvatarSeed } from '@/lib/avatar';
import { useIdentityStore } from '@/store';
import { toast } from 'sonner';

type Step = 'group' | 'member' | 'done';

export default function CreateGroup() {
  const router = useRouter();
  const setIdentity = useIdentityStore((s) => s.setIdentity);

  const [step, setStep] = useState<Step>('group');
  const [groupName, setGroupName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [avatarSeed] = useState(generateAvatarSeed);
  const [groupCode] = useState(generateGroupCode);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !memberName.trim()) return;
    setLoading(true);
    try {
      // 1. Create group (no created_by yet — circular FK)
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({ code: groupCode, name: groupName.trim() })
        .select()
        .single();

      if (groupError) throw groupError;

      // 2. Create owner member with group_id
      const { data: member, error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          name: memberName.trim(),
          avatar_seed: avatarSeed,
          role: 'owner',
          device_id: getDeviceId(),
        })
        .select()
        .single();

      if (memberError) throw memberError;

      // 3. Back-fill created_by on the group
      await supabase
        .from('groups')
        .update({ created_by: member.id })
        .eq('id', group.id);

      setIdentity(group.id, {
        groupId: group.id,
        groupCode: group.code,
        groupName: group.name,
        memberId: member.id,
        memberName: member.name,
        avatarSeed: member.avatar_seed,
        role: 'owner',
      });

      router.push(`/g/${group.code}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-8 gap-8">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
          <h1 className="font-display text-3xl font-bold">Create a group</h1>
          <p className="text-muted-foreground mt-1">Your crew plays together every time.</p>
        </div>

        <div className="space-y-6">
          {/* Group name */}
          <div className="space-y-2">
            <Label htmlFor="group-name">Group name</Label>
            <Input
              id="group-name"
              placeholder="The Elders, Saturday League…"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="h-14 text-base"
              onKeyDown={(e) => e.key === 'Enter' && groupName.trim() && document.getElementById('member-name')?.focus()}
            />
          </div>

          {/* Group code preview */}
          <div className="space-y-2">
            <Label>Your group code</Label>
            <div className="flex items-center gap-2 bg-card rounded-xl border border-white/8 px-4 py-3">
              <code className="flex-1 font-mono text-sm font-semibold text-foreground">{groupCode}</code>
              <button onClick={copyCode} className="text-muted-foreground hover:text-foreground transition-colors">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Share this so others can join your group</p>
          </div>

          {/* Your identity */}
          <div className="space-y-3">
            <Label htmlFor="member-name">Your name in this group</Label>
            <div className="flex items-center gap-3">
              <MemberAvatar seed={avatarSeed} size="md" />
              <Input
                id="member-name"
                placeholder="Your name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="h-14 text-base flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
              />
            </div>
            <p className="text-xs text-muted-foreground">Your avatar is auto-assigned. You keep this identity across all sessions.</p>
          </div>

          <Button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || !memberName.trim() || loading}
            className="w-full h-14 text-base font-semibold rounded-xl"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create group →'}
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('togetherly-device-id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('togetherly-device-id', id);
  }
  return id;
}
