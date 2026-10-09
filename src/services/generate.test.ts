import { describe, expect, it } from 'vitest';
import { generateWorld, requestWorld, GenerationError } from './generate';
import { scenarioSchema, sanitize } from '../validation';
import type { Scenario } from '../types';

const base: Scenario = {
  id: 's1',
  category: 'career',
  year: 2016,
  situation: '대기업 8년 차에 이직 제안을 받았던 때',
  choiceA: '현직에 남았다',
  choiceB: '이직을 선택했다',
};

describe('generateWorld', () => {
  it('같은 입력에는 같은 결과를 낸다', () => {
    expect(generateWorld(base)).toEqual(generateWorld(base));
  });
  it('점수는 20~95 범위이고 필수 필드가 채워진다', () => {
    const r = generateWorld(base);
    for (const v of [r.wealthScore, r.happinessScore, r.stressScore, r.familyScore, r.healthScore]) {
      expect(v).toBeGreaterThanOrEqual(20);
      expect(v).toBeLessThanOrEqual(95);
    }
    expect(r.timeline.length).toBeGreaterThan(0);
    expect(r.insights.length).toBe(3);
    expect(r.alternateStory).not.toBe('');
    expect(r.closing).not.toBe('');
  });
  it('금지 주제는 거부한다', async () => {
    await expect(requestWorld({ ...base, situation: '극단적 선택을 고민하던 때였다' })).rejects.toBeInstanceOf(GenerationError);
  });
});

describe('scenarioSchema', () => {
  const ok = { year: 2016, situation: '충분히 긴 상황 설명입니다', choiceA: 'A', choiceB: 'B' };
  it('정상 입력 통과', () => expect(scenarioSchema.safeParse(ok).success).toBe(true));
  it('1980 미만 연도 거부', () => expect(scenarioSchema.safeParse({ ...ok, year: 1979 }).success).toBe(false));
  it('미래 연도 거부', () => expect(scenarioSchema.safeParse({ ...ok, year: 3000 }).success).toBe(false));
  it('짧은 상황 거부', () => expect(scenarioSchema.safeParse({ ...ok, situation: '짧음' }).success).toBe(false));
  it('긴 선택지 거부', () => expect(scenarioSchema.safeParse({ ...ok, choiceA: 'a'.repeat(31) }).success).toBe(false));
  it('sanitize는 태그 문자를 제거한다', () => expect(sanitize('<b>안녕</b>')).toBe('b 안녕 /b'));
});
