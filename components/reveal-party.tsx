'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemberAvatar } from './member-avatar';
import type { SimilarityResult } from '@/lib/types';

interface RevealPartyProps {
  myMemberId: string;
  rankings: SimilarityResult[];
  accent: string;
}

export function RevealParty({ rankings, accent }: RevealPartyProps) {
  const [stage, setStage] = useState<'intro' | 'twin' | 'opposite' | 'full'>('intro');

  const twin = rankings[0];
  const opposite = rankings[rankings.length - 1];

  const next = () => {
    setStage((s) => {
      if (s === 'intro') return 'twin';
      if (s === 'twin') return 'opposite';
      if (s === 'opposite') return 'full';
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
            <p className="font-display text-4xl font-black">Your group<br />has spoken.</p>
            <p className="text-muted-foreground">tap to reveal</p>
          </motion.div>
        )}

        {stage === 'twin' && twin && (
          <motion.div
            key="twin"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="text-center space-y-6 cursor-pointer w-full"
            onClick={next}
          >
            <p className="text-muted-foreground uppercase tracking-widest text-xs">Your twin is…</p>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center gap-3"
            >
              <MemberAvatar seed={twin.avatarSeed} size="xl" />
              <p className="font-display text-3xl font-bold">{twin.name}</p>
              <div className="text-5xl font-black" style={{ color: accent }}>{twin.overall}%</div>
              <p className="text-sm text-muted-foreground">similarity</p>
            </motion.div>
            <p className="text-xs text-muted-foreground">tap to continue</p>
          </motion.div>
        )}

        {stage === 'opposite' && opposite && (
          <motion.div
            key="opposite"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="text-center space-y-6 cursor-pointer w-full"
            onClick={next}
          >
            <p className="text-muted-foreground uppercase tracking-widest text-xs">Your opposite is…</p>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="flex flex-col items-center gap-3"
            >
              <MemberAvatar seed={opposite.avatarSeed} size="xl" />
              <p className="font-display text-3xl font-bold">{opposite.name}</p>
              <div className="text-5xl font-black text-muted-foreground">{opposite.overall}%</div>
              <p className="text-sm text-muted-foreground">similarity</p>
            </motion.div>
            <p className="text-xs text-muted-foreground">tap for full rankings</p>
          </motion.div>
        )}

        {stage === 'full' && (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-4"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Full ranking</p>
            <div className="space-y-2">
              {rankings.map((r, i) => (
                <motion.div
                  key={r.memberId}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-card"
                >
                  <span className="text-xs text-muted-foreground w-5 text-center font-mono">#{i + 1}</span>
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
