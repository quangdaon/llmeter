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
 *   - K = number of AIs that chose the same option as the user
 *   - ai_alignment = K / M  (0 = no AI agreed, 1 = all AIs agreed)
 *   - weight = log2(N)  (more options → higher signal value; 2-option = weight 1, 7-option ≈ 2.81)
 *
 * weighted_score = Σ(ai_alignment × weight) / Σ(weight)
 *
 * Dispute easter egg: if disputeUsed, subtract 5 percentage points (max clamped to 0).
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
    const K = question.responses.filter((r) => r.selection === answer.answer).length;

    const aiAlignment = K / M;
    const weight = Math.log2(Math.max(N, 2)); // minimum weight of 1

    weightedSum += aiAlignment * weight;
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
