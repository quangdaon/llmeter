export interface Model {
  id: string;
  name: string;
  provider: string;
  logo: string;
  color: string;
}

export interface ModelResponse {
  modelId: string;
  selection: string;
  reasoning: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  responses: ModelResponse[];
}

export interface DataSet {
  generatedAt: string;
  models: Model[];
  questions: Question[];
}

// Sent to client — no AI responses
export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
}

export interface EvaluateRequest {
  answers: QuizAnswer[];
  disputeUsed: boolean;
  disputeText?: string;
}

export interface ModelMatch {
  modelId: string;
  matchCount: number;
  totalQuestions: number;
}

export interface QuestionResult {
  questionId: string;
  questionText: string;
  options: string[];
  userAnswer: string;
  aiResponses: ModelResponse[];
}

export interface EvaluateResponse {
  aiPercentage: number;
  aiLabel: string;
  aiLabelEmoji: string;
  modelMatches: ModelMatch[];
  questions: QuestionResult[];
  disputeBonus: boolean;
}
