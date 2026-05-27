const EMOJIS = [
  '🦁', '🐻', '🦊', '🐺', '🦋', '🦜', '🐬', '🐼', '🦒', '🦄',
  '🐨', '🦝', '🦩', '🦚', '🦀', '🐙', '🦔', '🦦', '🐿️', '🦌',
  '🦭', '🦈', '🦅', '🦉', '🐢', '🦎', '🐊', '🦏', '🐘', '🦓',
];

const COLORS = [
  '#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626',
  '#7c3aed', '#0891b2', '#65a30d', '#ea580c', '#9333ea',
  '#0284c7', '#16a34a', '#ca8a04', '#e11d48', '#7c3aed',
];

function hashSeed(seed: string): number {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) + hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getAvatarFromSeed(seed: string): { emoji: string; color: string } {
  const h = hashSeed(seed);
  return {
    emoji: EMOJIS[h % EMOJIS.length],
    color: COLORS[(h >> 4) % COLORS.length],
  };
}

export function generateAvatarSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
