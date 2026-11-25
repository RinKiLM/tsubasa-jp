export type GrammarRole = 'topic' | 'particle' | 'predicate' | 'modifier' | 'plain';

export interface RubyToken {
  text: string;
  ruby?: string;
  role?: GrammarRole;
}

export interface FormulaBlock {
  label: string;
  jp: string;
  role: GrammarRole;
}

export interface ExampleSentence {
  id: string;
  track: 'practical' | 'jlpt';
  contextTag: string;
  tokens: RubyToken[];
  translation: string;
  breakdown: string;
}

export interface LessonSection {
  heading: string;
  summary: string;
  points: string[];
  formula?: FormulaBlock[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface LessonPitfall {
  title: string;
  wrong: string;
  right: string;
  reason: string;
}

export interface QuizQuestion {
  id: string;
  type: 'choice' | 'order';
  prompt: string;
  sentence?: RubyToken[];
  options: string[];
  answer: string | string[];
  explanation: string;
}

export interface Lesson {
  id: string;
  number: string;
  stage: 'Stage 0' | 'Stage 1' | 'Stage 2' | 'Stage 3';
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  tags: string[];
  coreInsight: string;
  sections: LessonSection[];
  pitfall: LessonPitfall;
  examples: ExampleSentence[];
  quizzes: QuizQuestion[];
}

export interface MistakeRecord {
  id: string;
  source: 'lesson' | 'dojo';
  title: string;
  prompt: string;
  expected: string;
  userAnswer: string;
  explanation: string;
  timestamp: number;
}

export interface UserSettings {
  showFurigana: boolean;
  showTranslation: boolean;
  highlightRoles: boolean;
  darkMode: boolean;
  speechRate: number;
}

export interface UserProgress {
  completedLessons: string[];
  quizBestScores: Record<string, number>;
  dojoTotalAnswered: number;
  dojoTotalCorrect: number;
  dojoBestStreak: number;
  studyDates: string[];
  mistakes: MistakeRecord[];
  settings: UserSettings;
  updatedAt?: number;
}

export function tokensToPlainJapanese(tokens: RubyToken[]): string {
  return tokens.map((t) => t.text).join('');
}
