import type { Answer, PairwiseMatrix, SimilarityResult } from './types';

const SCALE = [-1.5, -0.5, 0.5, 1.5] as const;

function toVector(answers: Answer[], questionIds: string[]): number[] {
  return questionIds.map((qid) => {
    const a = answers.find((ans) => ans.question_id === qid);
    return a ? SCALE[a.value - 1] : 0;
  });
}

function cosine(a: number[], b: number[]): number {
  const dot = a.reduce((s, x, i) => s + x * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
  const magB = Math.sqrt(b.reduce((s, x) => s + x * x, 0));
  const cos = dot / (magA * magB || 1);
  return Math.round(((cos + 1) / 2) * 100);
}

export function computePairwiseSimilarity(
  memberAnswers: Record<string, Answer[]>,
  questionIds: string[]
): PairwiseMatrix {
  const memberIds = Object.keys(memberAnswers);
  const matrix: PairwiseMatrix = {};
  for (const idA of memberIds) {
    matrix[idA] = {};
    for (const idB of memberIds) {
      if (idA === idB) {
        matrix[idA][idB] = 100;
        continue;
      }
      const vecA = toVector(memberAnswers[idA], questionIds);
      const vecB = toVector(memberAnswers[idB], questionIds);
      matrix[idA][idB] = cosine(vecA, vecB);
    }
  }
  return matrix;
}

export function computeFamilyPairwiseSimilarity(
  memberAnswers: Record<string, Answer[]>,
  questionsByCategory: Record<string, string[]>
): { overall: PairwiseMatrix; byCategory: Record<string, PairwiseMatrix> } {
  const allQuestionIds = Object.values(questionsByCategory).flat();
  const overall = computePairwiseSimilarity(memberAnswers, allQuestionIds);
  const byCategory: Record<string, PairwiseMatrix> = {};
  for (const [cat, ids] of Object.entries(questionsByCategory)) {
    byCategory[cat] = computePairwiseSimilarity(memberAnswers, ids);
  }
  return { overall, byCategory };
}

export function getRankings(
  myMemberId: string,
  matrix: PairwiseMatrix,
  members: { id: string; name: string; avatar_seed: string }[]
): SimilarityResult[] {
  const scores = matrix[myMemberId] ?? {};
  return members
    .filter((m) => m.id !== myMemberId)
    .map((m) => ({ memberId: m.id, name: m.name, avatarSeed: m.avatar_seed, overall: scores[m.id] ?? 0 }))
    .sort((a, b) => b.overall - a.overall);
}

export function computeWhoKnowsMeBest(
  targetId: string,
  pass1Answers: Answer[],
  pass2ByMember: Record<string, Answer[]>,
  questionIds: string[]
): { memberId: string; score: number }[] {
  const targetVec = toVector(pass1Answers, questionIds);
  return Object.entries(pass2ByMember).map(([memberId, answers]) => {
    const guessVec = toVector(answers, questionIds);
    const mad = targetVec.reduce((s, v, i) => s + Math.abs(v - guessVec[i]), 0) / questionIds.length;
    const score = Math.round(Math.max(0, 100 - mad * 50));
    return { memberId, score };
  }).sort((a, b) => b.score - a.score);
}
