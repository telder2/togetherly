'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Plus, ArrowRight } from 'lucide-react';
import { useIdentityStore } from '@/store';
import type { IdentityEntry } from '@/store';

export default function Landing() {
  const [mounted, setMounted] = useState(false);
  const listIdentities = useIdentityStore((s) => s.listIdentities);
  const [recentGroups, setRecentGroups] = useState<IdentityEntry[]>([]);

  useEffect(() => {
    setMounted(true);
    setRecentGroups(listIdentities().slice(0, 3));
  }, [listIdentities]);

  const tiles = [
    {
      href: '/create',
      icon: <Plus className="w-6 h-6" />,
      label: 'Create a group',
      sub: 'Name your crew, get a shareable code',
      color: '#7c3aed',
    },
    {
      href: '/join',
      icon: <Users className="w-6 h-6" />,
      label: 'Join a group',
      sub: 'Enter a code or scan QR',
      color: '#2563eb',
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 gap-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight">
          togetherly
        </h1>
        <p className="text-muted-foreground text-lg max-w-xs mx-auto leading-relaxed">
          Answer questions with your group.<br />Find out who thinks like you.
        </p>
      </motion.div>

      <div className="w-full max-w-sm space-y-3">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
          >
            <Link href={tile.href}>
              <div
                className="flex items-center gap-4 rounded-2xl border border-white/8 bg-card p-5 hover:bg-white/5 transition-colors cursor-pointer group"
                style={{ borderLeftColor: tile.color, borderLeftWidth: 3 }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: tile.color + '22', color: tile.color }}
                >
                  {tile.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{tile.label}</p>
                  <p className="text-sm text-muted-foreground">{tile.sub}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}

        {mounted && recentGroups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="space-y-2"
          >
            <p className="text-xs text-muted-foreground px-1 pt-2 uppercase tracking-wider">Rejoin</p>
            {recentGroups.map((g) => (
              <Link key={g.groupId} href={`/g/${g.groupCode}`}>
                <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-card p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{g.groupName}</p>
                    <p className="text-xs text-muted-foreground">as {g.memberName} · {g.groupCode}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
