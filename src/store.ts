import { create } from 'zustand';
import type { Category, ParallelResult, Scenario, Step } from './types';

interface AppStore {
  step: Step;
  category: Category | null;
  scenario: Scenario | null;
  result: ParallelResult | null;
  go: (step: Step) => void;
  setCategory: (c: Category) => void;
  setScenario: (s: Scenario) => void;
  setResult: (r: ParallelResult | null) => void;
  reset: () => void;
}

export const useApp = create<AppStore>((set) => ({
  step: 'splash',
  category: null,
  scenario: null,
  result: null,
  go: (step) => set({ step }),
  setCategory: (category) => set({ category }),
  setScenario: (scenario) => set({ scenario }),
  setResult: (result) => set({ result }),
  reset: () => set({ step: 'category', category: null, scenario: null, result: null }),
}));
