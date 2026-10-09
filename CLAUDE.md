# CLAUDE.md — 만약에 그때로 돌아간다면? (IF?)

앱인토스 출품 목표의 평행세계 시뮬레이터. 타깃은 40대(직장인·학부모·자산 형성기·부모 돌봄 세대).

## 제품 원칙
- 결과의 끝은 항상 "지금의 선택이 만든 것"을 긍정하는 재해석 (`closing`). 목표는 재미와 후회 해소.
- 모든 결과 화면에 "재미용 시뮬레이션이며 실제 결과·투자 조언이 아님" 고지 노출.
- 금지: 미래 예언, 투자 수익 보장, 의료 조언, 정치 선동, 범죄 조장, 실존 인물, 자살 관련, 이혼·사별 등 민감 소재의 부정적 결말.
- 입력은 프리셋 카드 우선, 직접 입력은 보조 (40대는 탭 선택 선호).

## UI 규칙
본문 16px 이상, 터치 영역 48px 이상, 모바일 퍼스트, 접근성(aria-label, role=alert), 공유는 이미지 카드 + 시스템 공유.

## 스택
Vite + React + TypeScript(strict, no any) + Zustand + React Hook Form + Zod. (앱인토스 WebView 방식. 출품 시 TDS로 교체 예정)

## 구조
src/{screens, services, lib, store.ts, types.ts, validation.ts}

## 도메인
- Category: housing, investment, career, startup, family, parents, health, custom
- Scenario: id, category, year(1980~올해), situation(10~100자), choiceA(실제로 한 선택, ≤30), choiceB(해보지 못한 선택, ≤30)
- ParallelResult: summary, wealth/happiness/stress/family/health(20~95), timeline, insights, alternateStory, closing
- 점수 라벨: stress는 "마음의 무게"로 표기

## 분석 이벤트
view_splash/category/scenario/generating/result/share, select_category, submit_scenario, generate_parallel_world, share_result, save_image, copy_link

## 성능·완료 기준
첫 로드 < 2s, 결과 생성 < 5s, 공유 이미지 < 1s. 단위 테스트·타입 검사·빌드 통과, 모바일 확인, 공유 플로우 동작.

## 명령
npm run dev / test / build / typecheck
