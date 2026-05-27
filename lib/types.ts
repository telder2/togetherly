export type Group = {
  id: string;
  code: string;
  name: string;
  created_by: string | null;
  created_at: string;
};

export type GroupMember = {
  id: string;
  group_id: string;
  name: string;
  avatar_seed: string;
  role: 'owner' | 'member';
  device_id: string | null;
  joined_at: string;
};

export type Session = {
  id: string;
  group_id: string;
  code: string;
  mode: 'party' | 'family' | 'adult';
  theme: string;
  status: 'lobby' | 'playing' | 'revealed' | 'ended';
  host_member_id: string;
  current_question_index: number;
  created_at: string;
  revealed_at: string | null;
  session_results: PairwiseMatrix | null;
};

export type SessionParticipant = {
  session_id: string;
  member_id: string;
  joined_at: string;
};

export type Question = {
  id: string;
  mode: 'party' | 'family' | 'adult';
  theme: string;
  category: string | null;
  prompt: string;
  option_a: string;
  option_b: string;
  order_index: number;
};

export type Answer = {
  id: string;
  session_id: string;
  member_id: string;
  question_id: string;
  value: 1 | 2 | 3 | 4;
  target_member_id: string | null;
  created_at: string;
};

export type PairwiseMatrix = Record<string, Record<string, number>>;

export type SimilarityResult = {
  memberId: string;
  name: string;
  avatarSeed: string;
  overall: number;
  byCategory?: Record<string, number>;
};

export type RevealData = {
  rankings: SimilarityResult[];
  twin: SimilarityResult;
  opposite: SimilarityResult;
};

export type ThemeConfig = {
  id: string;
  label: string;
  emoji: string;
  accent: string;
  mode: 'party' | 'family' | 'adult';
  // Adult mode: theme stays secret during lobby + play, unveiled only at reveal.
  hidden?: boolean;
  // Adult mode: copy shown when a player is crowned with this verdict.
  crownLabel?: string;
  verdictLine?: string;
};

export const THEMES: ThemeConfig[] = [
  { id: 'athlete', label: 'Athlete', emoji: '🏋️', accent: '#22c55e', mode: 'party' },
  { id: 'parent', label: 'Parent', emoji: '👨‍👧', accent: '#f97316', mode: 'party' },
  { id: 'spouse', label: 'Spouse', emoji: '💍', accent: '#ec4899', mode: 'party' },
  { id: 'friend', label: 'Friend', emoji: '🤝', accent: '#3b82f6', mode: 'party' },
  { id: 'leader', label: 'Leader', emoji: '🎯', accent: '#eab308', mode: 'party' },
  { id: 'family_core', label: 'Family Deep Dive', emoji: '🏠', accent: '#f59e0b', mode: 'family' },

  // ─── ADULT (18+) — disguised quiz → verdict. Theme is random & hidden until reveal.
  // For every adult question, option_b is the "guilty"/verdict-leaning answer.
  {
    id: 'first_to_die', label: 'First to Die in a Horror Movie', emoji: '🔪', accent: '#dc2626', mode: 'adult', hidden: true,
    crownLabel: 'First to die 🔪',
    verdictLine: 'Splits off from the group, investigates the noise, walks toward the dark thing. Gone by minute twelve.',
  },
  {
    id: 'cheated_on', label: 'Most Likely to Get Cheated On', emoji: '💔', accent: '#ec4899', mode: 'adult', hidden: true,
    crownLabel: 'Most likely to get cheated on 💔',
    verdictLine: 'Sweet, trusting, and gloriously oblivious. Wouldn’t notice a new haircut, let alone a new "friend."',
  },
  {
    id: 'serial_killer', label: 'Secretly a Serial Killer', emoji: '🩸', accent: '#7f1d1d', mode: 'adult', hidden: true,
    crownLabel: 'Secretly a serial killer 🩸',
    verdictLine: 'Suspiciously calm. Immaculate freezer. "Kept to himself, seemed totally normal."',
  },
  {
    id: 'prison', label: 'First to End Up in Prison', emoji: '🚔', accent: '#f59e0b', mode: 'adult', hidden: true,
    crownLabel: 'First to end up in prison 🚔',
    verdictLine: 'Treats laws as gentle suggestions and fine print as a personal insult. We’ll visit on weekends.',
  },
  {
    id: 'villain_origin', label: 'Most Likely to Become a Supervillain', emoji: '😈', accent: '#8b5cf6', mode: 'adult', hidden: true,
    crownLabel: 'Future supervillain 😈',
    verdictLine: 'Has a list. Has a lair budget. Has a plan for the cats. This was always how it ended.',
  },
  {
    id: 'ghosted', label: 'Most Likely to Get Ghosted', emoji: '👻', accent: '#38bdf8', mode: 'adult', hidden: true,
    crownLabel: 'Most likely to get ghosted 👻',
    verdictLine: 'Said "I love you" on date two, triple-texts before noon, already named the dog you don’t have.',
  },
];

export const ADULT_THEMES = THEMES.filter((t) => t.mode === 'adult');

export function randomAdultTheme(): ThemeConfig {
  return ADULT_THEMES[Math.floor(Math.random() * ADULT_THEMES.length)];
}

export const FAMILY_CATEGORIES = ['Conflict', 'Love', 'Money', 'Loyalty', 'Values'] as const;
export type FamilyCategory = typeof FAMILY_CATEGORIES[number];
