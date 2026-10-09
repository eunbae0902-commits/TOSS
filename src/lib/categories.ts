import type { Category } from '../types';

export interface CategoryMeta {
  id: Category;
  label: string;
  emoji: string;
  desc: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'housing', label: '내 집 마련·이사', emoji: '🏠', desc: '전세, 매수, 이사의 갈림길' },
  { id: 'investment', label: '주식·코인·투자', emoji: '📈', desc: '살까 말까, 팔까 말까' },
  { id: 'career', label: '이직·승진·퇴사', emoji: '💼', desc: '남을까 떠날까' },
  { id: 'startup', label: '창업·부업', emoji: '🚀', desc: '도전했다면 어땠을까' },
  { id: 'family', label: '결혼·육아·교육', emoji: '👨‍👩‍👦', desc: '가족을 위한 선택들' },
  { id: 'parents', label: '부모님 돌봄', emoji: '🤝', desc: '효도와 내 삶 사이' },
  { id: 'health', label: '건강·운동', emoji: '💪', desc: '몸을 먼저 챙겼다면' },
  { id: 'custom', label: '직접 입력', emoji: '✍️', desc: '나만의 그날의 선택' },
];

export const categoryLabel = (id: Category): string =>
  CATEGORIES.find((c) => c.id === id)?.label ?? '';
