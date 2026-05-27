'use client';

import { motion } from 'motion/react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { MemberAvatar } from './member-avatar';
import type { SimilarityResult } from '@/lib/types';
import { FAMILY_CATEGORIES } from '@/lib/types';

interface RevealFamilyProps {
  myMemberId: string;
  rankings: SimilarityResult[];
  accent: string;
}

export function RevealFamily({ rankings, accent }: RevealFamilyProps) {
  const twin = rankings[0];
  const myCategoryScores = rankings[0]?.byCategory;

  const radarData = FAMILY_CATEGORIES.map((cat) => ({
    category: cat,
    score: myCategoryScores?.[cat] ?? 0,
  }));

  return (
    <div className="w-full max-w-sm mx-auto space-y-8 px-4">
      {/* Radar chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/8 bg-card p-4"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Your profile</p>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="category" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
            <Radar name="Me" dataKey="score" stroke={accent} fill={accent} fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Per-category top match */}
      {myCategoryScores && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Per category</p>
          {FAMILY_CATEGORIES.map((cat, i) => {
            const topMatch = rankings
              .slice()
              .sort((a, b) => (b.byCategory?.[cat] ?? 0) - (a.byCategory?.[cat] ?? 0))[0];
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-card"
              >
                <div>
                  <p className="text-sm font-semibold">{cat}</p>
                  <p className="text-xs text-muted-foreground">
                    Most like <span className="text-foreground">{topMatch?.name ?? '—'}</span>
                    {topMatch && <> ({topMatch.byCategory?.[cat] ?? 0}%)</>}
                  </p>
                </div>
                {topMatch && (
                  <MemberAvatar seed={topMatch.avatarSeed} size="sm" className="ml-auto" />
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Twin card */}
      {twin && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ backgroundColor: accent + '22', border: `1px solid ${accent}44` }}
        >
          <MemberAvatar seed={twin.avatarSeed} size="lg" />
          <div>
            <p className="text-xs uppercase tracking-wider" style={{ color: accent }}>Your overall twin</p>
            <p className="font-display text-2xl font-bold mt-0.5">{twin.name}</p>
            <p className="text-sm text-muted-foreground">{twin.overall}% match</p>
          </div>
        </motion.div>
      )}

      {/* Full ranking */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Full ranking</p>
        {rankings.map((r, i) => (
          <motion.div
            key={r.memberId}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-card"
          >
            <span className="text-xs text-muted-foreground w-5 font-mono text-center">#{i + 1}</span>
            <MemberAvatar seed={r.avatarSeed} size="sm" />
            <span className="flex-1 text-sm font-medium">{r.name}</span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: i === 0 ? accent : undefined }}>
              {r.overall}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
