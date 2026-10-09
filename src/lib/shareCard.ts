import type { ParallelResult, Scenario } from '../types';

const W = 1080;
const H = 1200;

const wrap = (ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] => {
  const lines: string[] = [];
  let line = '';
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxW) {
      lines.push(line);
      line = ch;
    } else line += ch;
  }
  if (line) lines.push(line);
  return lines;
};

export const renderShareCard = (s: Scenario, r: ParallelResult): HTMLCanvasElement => {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return c;

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#6D5BFF');
  g.addColorStop(1, '#8D7BFF');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#fff';
  ctx.font = '600 44px sans-serif';
  ctx.fillText('만약에 그때로 돌아간다면?', 80, 140);

  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath();
  ctx.roundRect(60, 200, W - 120, 880, 36);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.font = '700 60px sans-serif';
  let y = 300;
  for (const l of wrap(ctx, `${s.year}년, "${s.choiceB}"`, W - 200)) {
    ctx.fillText(l, 100, y);
    y += 80;
  }

  ctx.font = '400 38px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  y += 20;
  for (const l of wrap(ctx, r.summary, W - 200)) {
    ctx.fillText(l, 100, y);
    y += 56;
  }

  const rows: [string, number][] = [
    ['재정', r.wealthScore], ['행복', r.happinessScore], ['마음의 무게', r.stressScore],
    ['가족', r.familyScore], ['건강', r.healthScore],
  ];
  y += 40;
  for (const [label, v] of rows) {
    ctx.fillStyle = '#fff';
    ctx.font = '500 36px sans-serif';
    ctx.fillText(label, 100, y);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.roundRect(350, y - 30, 560, 26, 13); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.roundRect(350, y - 30, Math.max(26, (560 * v) / 100), 26, 13); ctx.fill();
    ctx.font = '600 34px sans-serif';
    ctx.fillText(String(v), 940, y);
    y += 76;
  }

  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '400 28px sans-serif';
  ctx.fillText('재미로 보는 시뮬레이션이며 실제 결과·투자 조언이 아니에요', 80, H - 90);
  return c;
};

export const canvasToBlob = (c: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => c.toBlob(resolve, 'image/png'));
