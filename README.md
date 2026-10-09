# 만약에 그때로 돌아간다면? (IF?)

그날 다른 선택을 했다면 지금의 나는 어떤 모습일까? 40대를 위한 평행세계 시뮬레이터이며, 앱인토스(토스 인앱) 출품을 목표로 합니다.

## 실행

```bash
npm install
npm run dev        # 개발 서버 (모바일 실기기 접속용 --host 포함)
npm test           # 단위 테스트
npm run build      # 타입 검사 + 프로덕션 빌드
```

## 현재 상태 (MVP)

- 흐름: Splash → 카테고리 → 시나리오(프리셋/직접 입력) → 생성 → 결과 → 공유 카드
- AI 생성은 목(mock)입니다: `src/services/generate.ts`의 `requestWorld`만 실제 API로 교체하면 됩니다.
- 스택: Vite + React 19 + TypeScript(strict) + Zustand + React Hook Form + Zod
- 분석 이벤트: `src/lib/analytics.ts` (앱인토스 Analytics 연동 지점)

## 앱인토스 출품 전 남은 일

1. 앱인토스 SDK 3.x(`@apps-in-toss/web-framework`) 연동과 `granite.config` 작성
2. UI를 TDS(`@toss/tds-mobile`)로 교체하고 검수 가이드에 맞춰 문구·다크패턴 점검
3. 실제 생성 API(LLM) 연동과 입력/출력 안전 필터 강화
4. 공유를 앱인토스 공유 기능으로 교체
5. 콘솔에서 앱 정보 등록 후 검수 요청
