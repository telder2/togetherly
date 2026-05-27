'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemberAvatar } from './member-avatar';
import type { SimilarityResult, ThemeConfig } from '@/lib/types';

interface RevealAdultProps {
  theme: ThemeConfig | null;
  rankings: SimilarityResult[];
}

type Stage = 'intro' | 'category' | 'crown' | 'full';

export function RevealAdult({ theme, rankings }: RevealAdultProps) {
  const [stage, setStage] = useState<Stage>('intro');

  const accent = theme?.accent ?? '#dc2626';
  const winner = rankings[0];

  const next = () => {
    setStage((s) => {
      if (s === 'intro') return 'category';
      if (s === 'category') return 'crown';
      if (s === 'crown') return 'full';
      return 'full';
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 max-w-sm mx-auto w-full">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-4 cursor-pointer w-full"
            onClick={next}
          >
            <p className="text-muted-foreground uppercase tracking-widest text-xs">🔞 The votes are in</p>
            <p className="font-display text-4xl font-black">The verdict<br />is in.</p>
            <p className="text-muted-foreground">tap to find out what you were even playing</p>
          </motion.div>
        )}

        {stage === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="text-center space-y-5 cursor-pointer w-full"
            onClick={next}
          >
            <p className="text-muted-foreground uppercase tracking-widest text-xs">The category was…</p>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
              className="space-y-3"
            >
              <div className="text-6xl">{theme?.emoji}</div>
              <p className="font-display text-3xl font-black leading-tight" style={{ color: accent }}>
                {theme?.label}
              </p>
            </motion.div>
            <p className="text-xs text-muted-foreground">tap for the guilty party</p>
          </motion.div>
        )}

        {stage === 'crown' && winner && (
          <motion.div
            key="crown"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="text-center space-y-6 cursor-pointer w-full"
            onClick={next}
          >
            <p className="text-muted-foreground uppercase tracking-widest text-xs">
              {theme?.crownLabel ?? 'The verdict'}
            </p>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="text-3xl">👑</div>
              <MemberAvatar seed={winner.avatarSeed} size="xl" />
              <p className="font-display text-3xl font-bold">{winner.name}</p>
              <div className="text-5xl font-black" style={{ color: accent }}>{winner.overall}%</div>
            </motion.div>
            {theme?.verdictLine && (
              <p className="text-sm text-muted-foreground italic leading-snug max-w-xs mx-auto">
                “{theme.verdictLine}”
              </p>
            )}
            <p className="text-xs text-muted-foreground">tap for the full lineup</p>
          </motion.div>
        )}

        {stage === 'full' && (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{theme?.emoji}</span>
              <p className="text-sm font-semibold">{theme?.label}</p>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">The lineup</p>
            <div className="space-y-2">
              {rankings.map((r, i) => (
                <motion.div
                  key={r.memberId}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-card"
                >
                  <span className="text-xs text-muted-foreground w-5 text-center font-mono">
                    {i === 0 ? '👑' : `#${i + 1}`}
                  </span>
                  <MemberAvatar seed={r.avatarSeed} size="sm" />
                  <span className="flex-1 font-medium text-sm">{r.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${r.overall}%`, backgroundColor: accent }} />
                    </div>
                    <span className="text-sm font-semibold tabular-nums w-8 text-right" style={{ color: i === 0 ? accent : undefined }}>
                      {r.overall}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
