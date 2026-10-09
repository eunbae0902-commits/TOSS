import { useEffect } from 'react';
import { useApp } from '../store';
import { track } from '../lib/analytics';

export function Splash() {
  const go = useApp((s) => s.go);
  useEffect(() => track('view_splash'), []);
  return (
    <section className="screen center hero">
      <div className="orb" aria-hidden>🌌</div>
      <h1>만약에 그때로 돌아간다면?</h1>
      <p className="muted">그날, 다른 선택을 했다면<br />지금의 나는 어떤 모습일까요?</p>
      <button className="btn primary block" onClick={() => go('category')}>평행세계 열어보기</button>
      <p className="notice">재미로 보는 시뮬레이션이에요. 실제 결과나 투자 조언이 아닙니다.</p>
    </section>
  );
}
