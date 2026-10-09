import { useEffect } from 'react';
import { useApp } from '../store';
import { CATEGORIES } from '../lib/categories';
import { track } from '../lib/analytics';

export function CategoryScreen() {
  const { go, setCategory } = useApp();
  useEffect(() => track('view_category'), []);
  return (
    <section className="screen">
      <h2>어떤 선택이 가장 궁금하세요?</h2>
      <div className="grid">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className="card cat"
            onClick={() => {
              setCategory(c.id);
              track('select_category', { category: c.id });
              go('scenario');
            }}
          >
            <span className="emoji" aria-hidden>{c.emoji}</span>
            <strong>{c.label}</strong>
            <span className="muted small">{c.desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
