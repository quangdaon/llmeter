import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getQuestions, getModels } from '$lib/server/data.js';
import { buildEvaluateResponse } from '$lib/server/scoring.js';
import type { EvaluateRequest } from '$lib/types.js';

export const POST: RequestHandler = async ({ request }) => {
  let body: EvaluateRequest;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Invalid JSON body');
  }

  if (!Array.isArray(body.answers) || body.answers.length === 0) {
    throw error(400, 'answers must be a non-empty array');
  }

  if (body.answers.length > 10) {
    throw error(400, 'Maximum 10 answers allowed');
  }

  for (const a of body.answers) {
    if (typeof a.questionId !== 'string' || typeof a.answer !== 'string') {
      throw error(400, 'Each answer must have questionId and answer strings');
    }
  }

  const questions = getQuestions();
  const models = getModels();
  const modelIds = models.map((m) => m.id);

  const result = buildEvaluateResponse(
    body.answers,
    questions,
    modelIds,
    !!body.disputeUsed
  );

  return json(result);
};
