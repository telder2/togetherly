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
  mode: 'party' | 'family';
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
  mode: 'party' | 'family';
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
  mode: 'party' | 'family';
};

export const THEMES: ThemeConfig[] = [
  { id: 'athlete', label: 'Athlete', emoji: '🏋️', accent: '#22c55e', mode: 'party' },
  { id: 'parent', label: 'Parent', emoji: '👨‍👧', accent: '#f97316', mode: 'party' },
  { id: 'spouse', label: 'Spouse', emoji: '💍', accent: '#ec4899', mode: 'party' },
  { id: 'friend', label: 'Friend', emoji: '🤝', accent: '#3b82f6', mode: 'party' },
  { id: 'leader', label: 'Leader', emoji: '🎯', accent: '#eab308', mode: 'party' },
  { id: 'family_core', label: 'Family Deep Dive', emoji: '🏠', accent: '#f59e0b', mode: 'family' },
];

export const FAMILY_CATEGORIES = ['Conflict', 'Love', 'Money', 'Loyalty', 'Values'] as const;
export type FamilyCategory = typeof FAMILY_CATEGORIES[number];
