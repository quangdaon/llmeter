import type { DataSet } from '$lib/types.js';
import rawData from './questions.json';

// Cast: Vite bundles this at build time. The interrogator writes to this file;
// rebuild the webapp after running it to pick up new responses.
const data = rawData as unknown as DataSet;

export function getDataSet(): DataSet {
  return data;
}

export function getModels() {
  return data.models;
}

export function getQuestions() {
  return data.questions;
}
