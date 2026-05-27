const ADJECTIVES = [
  'plum', 'azure', 'amber', 'coral', 'fern', 'slate', 'dusk', 'dawn', 'gold',
  'jade', 'ruby', 'sage', 'teal', 'wine', 'rose', 'storm', 'ember', 'frost',
  'moss', 'cobalt', 'cedar', 'crimson', 'opal', 'onyx', 'pearl',
];

const NOUNS = [
  'stardust', 'canyon', 'meadow', 'harbor', 'summit', 'valley', 'river',
  'forest', 'ocean', 'castle', 'garden', 'bridge', 'prism', 'lantern',
  'compass', 'echo', 'haven', 'ridge', 'grove', 'tide', 'beacon',
  'crest', 'ember', 'glade', 'hollow',
];

const SESSION_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateGroupCode(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}-${noun}-${num}`;
}

export function generateSessionCode(): string {
  return Array.from({ length: 4 }, () =>
    SESSION_CHARS[Math.floor(Math.random() * SESSION_CHARS.length)]
  ).join('');
}

export function normalizeCode(code: string): string {
  return code.toLowerCase().trim();
}
