'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { normalizeCode } from '@/lib/codes';

export default function JoinGroup() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const normalized = normalizeCode(code);
    if (!normalized) return;
    setLoading(true);
    try {
      const { data: group, error } = await supabase
        .from('groups')
        .select('id, code, name')
        .eq('code', normalized)
        .single();

      if (error || !group) {
        toast.error('Group not found. Check the code and try again.');
        return;
      }

      router.push(`/g/${group.code}/join`);
    } catch {
      toast.error('Something went wrong. Please try again.');
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
          <h1 className="font-display text-3xl font-bold">Join a group</h1>
          <p className="text-muted-foreground mt-1">Enter the group code someone shared with you.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Group code</Label>
            <Input
              id="code"
              placeholder="plum-stardust-42"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-14 text-base font-mono"
              autoCapitalize="none"
              autoCorrect="off"
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>

          <Button
            onClick={handleJoin}
            disabled={!code.trim() || loading}
            className="w-full h-14 text-base font-semibold rounded-xl"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Find group →'}
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
