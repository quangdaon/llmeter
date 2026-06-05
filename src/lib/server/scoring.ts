import type { Question, QuizAnswer, ModelMatch, EvaluateResponse, QuestionResult } from '$lib/types.js';

const AI_LABELS: Array<{ threshold: number; label: string; emoji: string }> = [
  { threshold: 85, label: 'Full AI Mode', emoji: '🤖' },
  { threshold: 70, label: 'Mostly Machine', emoji: '🦾' },
  { threshold: 55, label: 'Suspiciously Robotic', emoji: '🔌' },
  { threshold: 40, label: 'Suspiciously Balanced', emoji: '⚖️' },
  { threshold: 25, label: 'More Human Than Not', emoji: '🧑' },
  { threshold: 0, label: 'Proudly Human', emoji: '❤️' },
];

function getLabel(pct: number): { label: string; emoji: string } {
  for (const tier of AI_LABELS) {
    if (pct >= tier.threshold) return { label: tier.label, emoji: tier.emoji };
  }
  return { label: 'Proudly Human', emoji: '❤️' };
}

/**
 * Scoring algorithm:
 *
 * For each question with N options and M AI responses:
 *   - Count AI votes per option; K_max = most popular, K_min = least popular, K = user's option
 *   - spread = (K_max - K_min) / M  (0 = uniform, 1 = unanimous — measures signal strength)
 *   - normalized = (K - K_min) / (K_max - K_min)  (0 for least popular, 1 for most popular)
 *   - weight = log₂(max(N, 2)) × spread  (more options + more decisive split = higher weight)
 *   - Questions where spread = 0 (all options equally popular) are excluded — no signal
 *
 * weighted_score = Σ(normalized × weight) / Σ(weight)
 *
 * Guarantees: choosing the most popular option on every question → 100%;
 * choosing the least popular → 0%.
 *
 * Dispute easter egg: if disputeUsed, subtract 5 percentage points (clamped to 0).
 */
export function computeScore(
  answers: QuizAnswer[],
  questions: Question[],
  disputeUsed: boolean
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question || question.responses.length === 0) continue;

    const N = question.options.length;
    const M = question.responses.length;

    const voteCounts = question.options.map(
      (opt) => question.responses.filter((r) => r.selection === opt).length
    );
    const K_max = Math.max(...voteCounts);
    const K_min = Math.min(...voteCounts);
    const spread = (K_max - K_min) / M;

    if (spread === 0) continue; // all options equally popular — no signal

    const K = question.responses.filter((r) => r.selection === answer.answer).length;
    const normalized = (K - K_min) / (K_max - K_min);
    const weight = Math.log2(Math.max(N, 2)) * spread;

    weightedSum += normalized * weight;
    totalWeight += weight;
  }

  let score = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;

  if (disputeUsed) {
    score = Math.max(0, score - 5);
  }

  return Math.round(score);
}

export function computeModelMatches(
  answers: QuizAnswer[],
  questions: Question[],
  modelIds: string[]
): ModelMatch[] {
  return modelIds.map((modelId) => {
    let matchCount = 0;
    let total = 0;

    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) continue;
      const modelResponse = question.responses.find((r) => r.modelId === modelId);
      if (!modelResponse) continue;
      total++;
      if (modelResponse.selection === answer.answer) matchCount++;
    }

    return { modelId, matchCount, totalQuestions: total };
  });
}

export function buildEvaluateResponse(
  answers: QuizAnswer[],
  questions: Question[],
  modelIds: string[],
  disputeUsed: boolean
): EvaluateResponse {
  const aiPercentage = computeScore(answers, questions, disputeUsed);
  const { label, emoji } = getLabel(aiPercentage);
  const modelMatches = computeModelMatches(answers, questions, modelIds);

  const questionResults: QuestionResult[] = answers
    .map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) return null;
      return {
        questionId: question.id,
        questionText: question.text,
        options: question.options,
        userAnswer: answer.answer,
        aiResponses: question.responses,
      };
    })
    .filter((r): r is QuestionResult => r !== null);

  return {
    aiPercentage,
    aiLabel: label,
    aiLabelEmoji: emoji,
    modelMatches,
    questions: questionResults,
    disputeBonus: disputeUsed,
  };
}
