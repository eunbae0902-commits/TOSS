import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '../store';
import { PRESETS } from '../lib/presets';
import { categoryLabel } from '../lib/categories';
import { scenarioSchema, sanitize, currentYear, type ScenarioInput, type ScenarioFormValues } from '../validation';
import { track } from '../lib/analytics';

export function ScenarioScreen() {
  const { category, go, setScenario } = useApp();
  const [picked, setPicked] = useState<number | null>(null);
  const cat = category ?? 'custom';
  const presets = PRESETS[cat];
  const [manual, setManual] = useState(presets.length === 0);

  const {
    register, handleSubmit, reset, watch,
    formState: { errors },
  } = useForm<ScenarioFormValues, unknown, ScenarioInput>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: { year: currentYear() - 10, situation: '', choiceA: '', choiceB: '' },
  });

  useEffect(() => track('view_scenario'), []);

  const choose = (i: number) => {
    const p = presets[i];
    if (!p) return;
    setPicked(i);
    setManual(false);
    reset(p);
  };

  const onSubmit = (v: ScenarioInput) => {
    const clean = {
      year: v.year,
      situation: sanitize(v.situation),
      choiceA: sanitize(v.choiceA),
      choiceB: sanitize(v.choiceB),
    };
    setScenario({ id: crypto.randomUUID(), category: cat, ...clean });
    track('submit_scenario', { category: cat });
    go('generating');
  };

  const filled = watch('situation').length > 0;

  return (
    <section className="screen">
      <button className="link" onClick={() => go('category')}>← 다시 고르기</button>
      <h2>{categoryLabel(cat)}</h2>

      {presets.length > 0 && (
        <>
          <p className="muted">비슷한 순간을 눌러 보세요</p>
          <div className="stack">
            {presets.map((p, i) => (
              <button
                key={p.situation}
                className={`card choice ${picked === i && !manual ? 'on' : ''}`}
                onClick={() => choose(i)}
              >
                <strong>{p.year}년 · {p.situation}</strong>
                <span className="muted small">{p.choiceA} ↔ {p.choiceB}</span>
              </button>
            ))}
            <button className={`card choice ${manual ? 'on' : ''}`} onClick={() => { setManual(true); setPicked(null); reset({ year: currentYear() - 10, situation: '', choiceA: '', choiceB: '' }); }}>
              <strong>✍️ 직접 입력할래요</strong>
            </button>
          </div>
        </>
      )}

      {(picked !== null || manual) && (
        <form onSubmit={handleSubmit(onSubmit)} className="stack" noValidate>
          <label>
            언제였나요? (연도)
            <input type="number" inputMode="numeric" {...register('year')} aria-invalid={!!errors.year} />
            {errors.year && <span className="error" role="alert">{errors.year.message}</span>}
          </label>
          <label>
            그때 어떤 상황이었나요?
            <textarea rows={3} maxLength={100} {...register('situation')} aria-invalid={!!errors.situation} />
            {errors.situation && <span className="error" role="alert">{errors.situation.message}</span>}
          </label>
          <label>
            실제로 한 선택
            <input maxLength={30} {...register('choiceA')} aria-invalid={!!errors.choiceA} />
            {errors.choiceA && <span className="error" role="alert">{errors.choiceA.message}</span>}
          </label>
          <label>
            해보지 못한 선택
            <input maxLength={30} {...register('choiceB')} aria-invalid={!!errors.choiceB} />
            {errors.choiceB && <span className="error" role="alert">{errors.choiceB.message}</span>}
          </label>
          <button className="btn primary block" type="submit" disabled={!filled && manual}>
            평행세계 생성하기
          </button>
        </form>
      )}
    </section>
  );
}
