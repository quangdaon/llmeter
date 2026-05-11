import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import { getQuestions, getModels } from '$lib/server/data.js';
import type { QuestionResult } from '$lib/types.js';

// Never prerender — this route only exists in the dev server.
export const prerender = false;

export function load() {
  if (!dev) error(404, 'Not found');

  const questions = getQuestions();
  const models = getModels();

  const questionResults: QuestionResult[] = questions.map((q) => ({
    questionId: q.id,
    questionText: q.text,
    options: q.options,
    userAnswer: '',
    aiResponses: q.responses,
  }));

  return { questions: questionResults, models };
}
