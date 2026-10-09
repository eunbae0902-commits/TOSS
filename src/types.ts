export type Category =
  | 'housing'
  | 'investment'
  | 'career'
  | 'startup'
  | 'family'
  | 'parents'
  | 'health'
  | 'custom';

export interface Scenario {
  id: string;
  category: Category;
  year: number;
  situation: string;
  /** 그때 실제로 한 선택 */
  choiceA: string;
  /** 해보지 못한 다른 선택 (평행세계의 선택) */
  choiceB: string;
}

export interface ParallelResult {
  worldId: string;
  summary: string;
  wealthScore: number;
  happinessScore: number;
  stressScore: number;
  familyScore: number;
  healthScore: number;
  timeline: string[];
  insights: string[];
  alternateStory: string;
  closing: string;
}

export type Step = 'splash' | 'category' | 'scenario' | 'generating' | 'result' | 'share';
