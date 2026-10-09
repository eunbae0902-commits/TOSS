import { useEffect, useState } from 'react';
import { useApp } from '../store';
import { requestWorld, GenerationError } from '../services/generate';
import { track } from '../lib/analytics';

const MESSAGES = ['그날로 돌아가는 중…', '다른 선택의 길을 걷는 중…', '평행세계를 그리는 중…'];

export function Generating() {
  const { scenario, go, setResult } = useApp();
  const [msg, setMsg] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => track('view_generating'), []);
  useEffect(() => {
    const t = setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!scenario) { go('category'); return; }
    const ctrl = new AbortController();
    setError(null);
    requestWorld(scenario, ctrl.signal)
      .then((r) => {
        setResult(r);
        track('generate_parallel_world', { category: scenario.category });
        go('result');
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError(e instanceof GenerationError ? e.message : '잠시 문제가 생겼어요. 다시 시도해 주세요.');
      });
    return () => ctrl.abort();
  }, [scenario, attempt, go, setResult]);

  if (error) {
    return (
      <section className="screen center">
        <p role="alert">{error}</p>
        <button className="btn primary block" onClick={() => setAttempt((a) => a + 1)}>다시 시도</button>
        <button className="btn ghost block" onClick={() => go('scenario')}>내용 수정하기</button>
      </section>
    );
  }
  return (
    <section className="screen center" aria-live="polite">
      <div className="spinner" aria-hidden />
      <p className="big">{MESSAGES[msg]}</p>
    </section>
  );
}
