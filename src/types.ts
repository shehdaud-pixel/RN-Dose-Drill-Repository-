export type QuestionCategory =
  | 'oral-solids'
  | 'oral-liquids'
  | 'injections'
  | 'iv-flow-rate'
  | 'iv-drop-rate'
  | 'weight-based'
  | 'reconstitution'
  | 'high-alert';

export interface Question {
  id: number;
  category: QuestionCategory;
  categoryLabel: string;
  order: string;
  supply: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  formula: string;
  rationale: string;
  clinicalTip?: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export type QuizViewMode = 'quiz' | 'summary' | 'review';
