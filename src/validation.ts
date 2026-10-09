import { z } from 'zod';

export const currentYear = (): number => new Date().getFullYear();

export const scenarioSchema = z.object({
  year: z.coerce
    .number({ error: '연도를 입력해 주세요' })
    .int('연도는 정수로 입력해 주세요')
    .min(1980, '1980년 이후만 선택할 수 있어요')
    .refine((v) => v <= currentYear(), '올해까지만 선택할 수 있어요'),
  situation: z
    .string()
    .trim()
    .min(10, '그때 상황을 10자 이상 적어 주세요')
    .max(100, '100자 이내로 적어 주세요'),
  choiceA: z.string().trim().min(1, '실제로 한 선택을 적어 주세요').max(30, '30자 이내로 적어 주세요'),
  choiceB: z.string().trim().min(1, '해보지 못한 선택을 적어 주세요').max(30, '30자 이내로 적어 주세요'),
});

export type ScenarioInput = z.output<typeof scenarioSchema>;
export type ScenarioFormValues = z.input<typeof scenarioSchema>;

/** 입력은 React가 이스케이프하지만, 제어문자와 태그 문자를 한 번 더 제거한다. */
export const sanitize = (s: string): string =>
  // eslint-disable-next-line no-control-regex
  s.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim();

const BLOCKED = ['자살', '죽고', '극단적 선택', '살인', '마약'];
export const hasBlockedContent = (...texts: string[]): boolean =>
  texts.some((t) => BLOCKED.some((w) => t.includes(w)));
