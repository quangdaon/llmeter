import type { PageServerLoad } from './$types';
import { getQuestions, getModels } from '$lib/server/data.js';

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const load: PageServerLoad = () => {
  const allQuestions = getQuestions();
  const models = getModels();

  const shuffled = shuffleArray(allQuestions);
  const selected = shuffled.slice(0, Math.min(10, shuffled.length));

  // Strip AI responses — client only gets question text and options
  const questions = selected.map(({ id, text, options }) => ({ id, text, options }));

  return { questions, models };
};
