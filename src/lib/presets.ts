import type { Category } from '../types';

export interface Preset {
  year: number;
  situation: string;
  choiceA: string;
  choiceB: string;
}

export const PRESETS: Record<Category, Preset[]> = {
  housing: [
    { year: 2015, situation: '전세 만기를 앞두고 내 집 마련을 고민하던 때', choiceA: '전세를 유지했다', choiceB: '대출을 받아 집을 샀다' },
    { year: 2017, situation: '아이 학교 때문에 이사를 고민하던 때', choiceA: '살던 곳에 남았다', choiceB: '학군지로 이사했다' },
  ],
  investment: [
    { year: 2017, situation: '코인과 주식 열풍이 한창이던 때', choiceA: '지켜만 봤다', choiceB: '용기 내어 투자를 시작했다' },
    { year: 2020, situation: '주가가 급락해 모두가 두려워하던 때', choiceA: '손절하고 나왔다', choiceB: '꾹 참고 보유했다' },
  ],
  career: [
    { year: 2016, situation: '대기업 8년 차에 이직 제안을 받았던 때', choiceA: '현직에 남았다', choiceB: '이직을 선택했다' },
    { year: 2019, situation: '팀장 승진과 해외 근무 제안이 겹쳤던 때', choiceA: '국내에 남았다', choiceB: '해외 근무를 택했다' },
  ],
  startup: [
    { year: 2014, situation: '퇴사하고 창업할 기회가 찾아왔던 때', choiceA: '회사에 남았다', choiceB: '퇴사하고 창업했다' },
    { year: 2018, situation: '퇴근 후 부업을 시작할 수 있었던 때', choiceA: '본업에만 집중했다', choiceB: '부업을 시작했다' },
  ],
  family: [
    { year: 2016, situation: '첫 아이가 태어나 육아 분담을 정하던 때', choiceA: '맞벌이를 유지했다', choiceB: '한 사람이 휴직했다' },
    { year: 2018, situation: '아이 교육 방식을 고민하던 때', choiceA: '학원 중심으로 갔다', choiceB: '함께 보내는 시간을 늘렸다' },
  ],
  parents: [
    { year: 2019, situation: '부모님 건강이 나빠져 돌봄을 결정하던 때', choiceA: '요양 서비스를 이용했다', choiceB: '함께 모시고 살았다' },
    { year: 2021, situation: '고향에 계신 부모님이 혼자가 되셨던 때', choiceA: '지금 사는 곳에 남았다', choiceB: '부모님 가까이로 이사했다' },
  ],
  health: [
    { year: 2018, situation: '건강검진에서 주의 소견을 받았던 때', choiceA: '바빠서 미뤘다', choiceB: '바로 운동과 식단을 바꿨다' },
    { year: 2020, situation: '하던 운동을 그만둘지 고민하던 때', choiceA: '운동을 그만뒀다', choiceB: '꾸준히 이어갔다' },
  ],
  custom: [],
};
