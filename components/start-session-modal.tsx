'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { generateSessionCode } from '@/lib/codes';
import { THEMES, randomAdultTheme } from '@/lib/types';
import type { Group, ThemeConfig } from '@/lib/types';
import type { IdentityEntry } from '@/store';
import { toast } from 'sonner';

interface StartSessionModalProps {
  open: boolean;
  onClose: () => void;
  group: Group;
  identity: IdentityEntry | null;
}

export function StartSessionModal({ open, onClose, group, identity }: StartSessionModalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [adultLoading, setAdultLoading] = useState(false);

  const partyThemes = THEMES.filter((t) => t.mode === 'party');
  const familyThemes = THEMES.filter((t) => t.mode === 'family');

  const createSession = async (theme: ThemeConfig) => {
    if (!identity) return;
    const sessionCode = generateSessionCode();
    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        group_id: group.id,
        code: sessionCode,
        mode: theme.mode,
        theme: theme.id,
        status: 'lobby',
        host_member_id: identity.memberId,
        current_question_index: 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Host auto-joins as participant
    await supabase.from('session_participants').insert({
      session_id: session.id,
      member_id: identity.memberId,
    });

    router.push(`/s/${session.id}/lobby`);
  };

  const handleStart = async () => {
    if (!selected || !identity) return;
    setLoading(true);
    try {
      await createSession(selected);
    } catch (err) {
      console.error(err);
      toast.error('Failed to start session.');
    } finally {
      setLoading(false);
    }
  };

  // Adult mode: pick a random theme so nobody — not even the host — knows what's
  // being measured until the reveal.
  const handleStartAdult = async () => {
    if (!identity) return;
    setAdultLoading(true);
    try {
      await createSession(randomAdultTheme());
    } catch (err) {
      console.error(err);
      toast.error('Failed to start session.');
    } finally {
      setAdultLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl p-6 pb-10 max-w-sm mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Pick a mode</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Party section */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Party mode — 12 questions, quick</p>
                <div className="grid grid-cols-2 gap-2">
                  {partyThemes.map((theme) => (
                    <ThemeTile
                      key={theme.id}
                      theme={theme}
                      selected={selected?.id === theme.id}
                      onSelect={() => setSelected(theme)}
                    />
                  ))}
                </div>
              </div>

              {/* Family section */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Family mode — 25 questions, deep</p>
                <div className="grid grid-cols-1 gap-2">
                  {familyThemes.map((theme) => (
                    <ThemeTile
                      key={theme.id}
                      theme={theme}
                      selected={selected?.id === theme.id}
                      onSelect={() => setSelected(theme)}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleStart}
                disabled={!selected || loading}
                className="w-full h-14 text-base font-semibold rounded-xl mt-2"
                style={selected ? { background: `linear-gradient(135deg, ${selected.accent}, ${selected.accent}99)` } : {}}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : selected ? (
                  `Start ${selected.label} →`
                ) : (
                  'Choose a theme'
                )}
              </Button>

              {/* 18+ Bros — random hidden theme, dark humor */}
              <div className="pt-2 border-t border-white/8">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">🔞 For the bros · 18+</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Dark, funny, ruthless. You won’t know what you’re being judged on until the verdict drops.
                </p>
                <Button
                  onClick={handleStartAdult}
                  disabled={loading || adultLoading}
                  className="w-full h-14 text-base font-semibold rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #7f1d1d)' }}
                >
                  {adultLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Mystery Round 🔪'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ThemeTile({ theme, selected, onSelect }: { theme: ThemeConfig; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 p-3 rounded-xl border transition-all text-left"
      style={{
        borderColor: selected ? theme.accent : 'rgb(255 255 255 / 0.08)',
        backgroundColor: selected ? theme.accent + '22' : 'transparent',
      }}
    >
      <span className="text-2xl">{theme.emoji}</span>
      <div>
        <p className="font-semibold text-sm">{theme.label}</p>
        <p className="text-xs text-muted-foreground">{theme.mode}</p>
      </div>
    </button>
  );
}
