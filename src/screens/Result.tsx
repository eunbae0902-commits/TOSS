import { useEffect } from 'react';
import { useApp } from '../store';
import { track } from '../lib/analytics';

const Bar = ({ label, value, warn }: { label: string; value: number; warn?: boolean }) => (
  <div className="metric">
    <div className="row"><span>{label}</span><strong>{value}</strong></div>
    <div className="bar" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={warn ? 'fill warn' : 'fill'} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export function Result() {
  const { result: r, scenario: s, go, reset } = useApp();
  useEffect(() => track('view_result'), []);
  if (!r || !s) { return null; }
  return (
    <section className="screen">
      <div className="card hero-card">
        <p className="small">{s.year}년 · {s.choiceA} → <b>{s.choiceB}</b></p>
        <h2>{r.summary}</h2>
      </div>

      <div className="card">
        <Bar label="재정" value={r.wealthScore} />
        <Bar label="행복" value={r.happinessScore} />
        <Bar label="마음의 무게" value={r.stressScore} warn />
        <Bar label="가족" value={r.familyScore} />
        <Bar label="건강" value={r.healthScore} />
      </div>

      <div className="card">
        <h3>그날 이후의 시간</h3>
        <ol className="timeline">{r.timeline.map((t) => <li key={t}>{t}</li>)}</ol>
      </div>

      <div className="card">
        <h3>평행세계 이야기</h3>
        <p>{r.alternateStory}</p>
      </div>

      <div className="card">
        <h3>알게 된 것</h3>
        <ul>{r.insights.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>

      <div className="card closing"><p>{r.closing}</p></div>

      <button className="btn primary block" onClick={() => go('share')}>결과 공유하기</button>
      <button className="btn ghost block" onClick={reset}>다른 선택도 궁금해요</button>
      <p className="notice">재미로 보는 시뮬레이션이며 실제 결과나 투자 조언이 아닙니다.</p>
    </section>
  );
}
