import type { Category, ParallelResult, Scenario } from '../types';
import { hasBlockedContent } from '../validation';

/** 같은 입력은 항상 같은 결과가 나오도록 하는 시드 기반 난수 */
const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const clamp = (n: number): number => Math.max(20, Math.min(95, Math.round(n)));

interface Bias {
  wealth: number;
  happiness: number;
  stress: number;
  family: number;
  health: number;
}

/** 카테고리별로 "다른 선택"이 어느 축에 기울기를 주는지(-15 ~ +15) */
const BIAS: Record<Category, Bias> = {
  housing: { wealth: 10, happiness: 2, stress: 12, family: 4, health: -3 },
  investment: { wealth: 12, happiness: 0, stress: 14, family: -2, health: -5 },
  career: { wealth: 8, happiness: 3, stress: 8, family: -4, health: -4 },
  startup: { wealth: 6, happiness: 5, stress: 15, family: -8, health: -8 },
  family: { wealth: -6, happiness: 9, stress: -2, family: 14, health: 2 },
  parents: { wealth: -5, happiness: 6, stress: 6, family: 12, health: -3 },
  health: { wealth: 0, happiness: 8, stress: -10, family: 5, health: 15 },
  custom: { wealth: 3, happiness: 4, stress: 3, family: 3, health: 0 },
};

interface Story {
  gain: string;
  cost: string;
  turn: string;
}

const STORIES: Record<Category, Story> = {
  housing: {
    gain: '집이라는 든든한 기반이 생겨 마음의 안정을 얻었어요',
    cost: '매달 나가는 대출 이자와 이사 부담이 어깨를 눌렀어요',
    turn: '이웃과 동네에 깊이 뿌리내리며 아이의 일상이 달라졌어요',
  },
  investment: {
    gain: '자산이 불어나는 순간들을 직접 겪으며 시장을 보는 눈이 생겼어요',
    cost: '계좌가 출렁일 때마다 잠 못 드는 밤이 늘었어요',
    turn: '결국 투자보다 중요한 건 흔들리지 않는 원칙이라는 걸 배웠어요',
  },
  career: {
    gain: '새로운 환경에서 배운 것들이 커리어의 폭을 넓혀 주었어요',
    cost: '익숙한 동료와 안정감을 잃고 처음부터 증명해야 했어요',
    turn: '결국 일의 의미를 다시 묻게 되는 계기가 되었어요',
  },
  startup: {
    gain: '내 이름을 건 일에서 오는 몰입과 성취감을 맛보았어요',
    cost: '불안정한 수입과 쉼 없는 책임이 일상을 채웠어요',
    turn: '성공 여부와 관계없이 스스로를 더 단단하게 알게 되었어요',
  },
  family: {
    gain: '아이와 배우자와 함께한 시간이 쌓여 따뜻한 추억이 늘었어요',
    cost: '가계와 경력 면에서는 쉽지 않은 조정이 필요했어요',
    turn: '가족의 대화가 깊어지며 서로를 더 이해하게 되었어요',
  },
  parents: {
    gain: '부모님과 나눈 시간이 마음에 오래 남는 선물이 되었어요',
    cost: '내 시간과 체력을 나누느라 스스로를 돌볼 여유가 줄었어요',
    turn: '돌봄의 정답은 하나가 아니라는 걸 몸으로 배웠어요',
  },
  health: {
    gain: '몸이 가벼워지고 하루의 에너지가 눈에 띄게 달라졌어요',
    cost: '일과 약속을 일부 내려놓는 용기가 필요했어요',
    turn: '건강이 모든 선택의 바탕이라는 걸 일찍 알게 되었어요',
  },
  custom: {
    gain: '새로운 경험이 삶에 예상치 못한 활력을 가져왔어요',
    cost: '익숙한 방식을 벗어나느라 적응의 시간이 필요했어요',
    turn: '결과보다 선택 이후의 태도가 더 큰 차이를 만든다는 걸 알게 되었어요',
  },
};

export const generateWorld = (s: Scenario): ParallelResult => {
  const rng = mulberry32(hash(`${s.category}|${s.year}|${s.situation}|${s.choiceA}|${s.choiceB}`));
  const b = BIAS[s.category];
  const story = STORIES[s.category];
  const score = (base: number, bias: number) => clamp(base + bias * (0.5 + rng()) + (rng() - 0.5) * 16);

  const wealthScore = score(58, b.wealth);
  const happinessScore = score(62, b.happiness);
  const stressScore = score(52, b.stress);
  const familyScore = score(64, b.family);
  const healthScore = score(60, b.health);

  const now = new Date().getFullYear();
  const mid = Math.min(s.year + Math.max(2, Math.round((now - s.year) / 2)), now);

  const timeline = [
    `${s.year}년 · "${s.choiceB}" — 평행세계가 갈라진 날`,
    `${Math.min(s.year + 1, now)}년 · ${story.gain}`,
    `${mid}년 · ${story.cost}`,
    `${now}년 · ${story.turn}`,
  ];

  const top = (
    [
      ['재정', wealthScore],
      ['행복', happinessScore],
      ['가족', familyScore],
      ['건강', healthScore],
    ] as const
  )
    .slice()
    .sort((x, y) => y[1] - x[1])[0];

  const insights = [
    `이 세계에서는 '${top?.[0] ?? '행복'}' 점수가 가장 높았어요.`,
    stressScore >= 65
      ? '대신 마음의 무게도 더 컸어요. 얻는 것이 있으면 지는 것도 있었어요.'
      : '마음의 무게는 지금과 크게 다르지 않았어요.',
    `"${s.choiceA}" 선택에서만 얻을 수 있었던 것들도 분명히 있었어요.`,
  ];

  const alternateStory =
    `${s.year}년, ${s.situation}. 그날 당신은 "${s.choiceA}" 대신 "${s.choiceB}"를 선택했습니다. ` +
    `${story.gain}. 하지만 ${story.cost}. ` +
    `시간이 흐른 뒤 ${story.turn}.`;

  const closing = `다른 세계의 당신도 나름의 기쁨과 무게를 안고 살았어요. 지금의 당신은 그날 "${s.choiceA}"를 선택했기에 만난 사람과 경험을 가지고 있습니다.`;

  return {
    worldId: `world_${hash(s.id + s.situation).toString(36)}`,
    summary: `"${s.choiceB}"를 선택한 평행세계의 ${now - s.year}년을 들여다봤어요.`,
    wealthScore,
    happinessScore,
    stressScore,
    familyScore,
    healthScore,
    timeline,
    insights,
    alternateStory,
    closing,
  };
};

export class GenerationError extends Error {}

/** 목 API: 실제 서버 연동 시 이 함수만 교체한다. */
export const requestWorld = async (s: Scenario, signal?: AbortSignal): Promise<ParallelResult> => {
  if (hasBlockedContent(s.situation, s.choiceA, s.choiceB)) {
    throw new GenerationError('이 주제는 시뮬레이션할 수 없어요. 다른 선택으로 시도해 주세요.');
  }
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, 1800);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('aborted', 'AbortError'));
    });
  });
  return generateWorld(s);
};
