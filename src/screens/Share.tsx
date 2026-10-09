import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../store';
import { renderShareCard, canvasToBlob } from '../lib/shareCard';
import { track } from '../lib/analytics';

export function Share() {
  const { result: r, scenario: s, go } = useApp();
  const [toast, setToast] = useState('');
  const canvas = useMemo(() => (r && s ? renderShareCard(s, r) : null), [r, s]);
  const dataUrl = useMemo(() => canvas?.toDataURL('image/png') ?? '', [canvas]);

  useEffect(() => track('view_share'), []);
  if (!r || !s || !canvas) return null;

  const say = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2000); };
  const text = `${s.year}년 "${s.choiceB}" 선택을 했다면? ${r.summary}`;

  const share = async () => {
    track('share_result', { category: s.category });
    const blob = await canvasToBlob(canvas);
    try {
      if (blob && navigator.canShare?.({ files: [new File([blob], 'parallel-world.png', { type: 'image/png' })] })) {
        await navigator.share({ title: '만약에 그때로 돌아간다면?', text, files: [new File([blob], 'parallel-world.png', { type: 'image/png' })] });
      } else if (navigator.share) {
        await navigator.share({ title: '만약에 그때로 돌아간다면?', text, url: location.href });
      } else {
        await navigator.clipboard.writeText(`${text}\n${location.href}`);
        say('공유 문구를 복사했어요');
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) say('공유하지 못했어요');
    }
  };

  const save = () => {
    track('save_image');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'parallel-world.png';
    a.click();
  };

  const copy = async () => {
    track('copy_link');
    try {
      await navigator.clipboard.writeText(location.href);
      say('링크를 복사했어요');
    } catch {
      say('복사하지 못했어요');
    }
  };

  return (
    <section className="screen">
      <button className="link" onClick={() => go('result')}>← 결과로 돌아가기</button>
      <h2>친구에게 공유해 보세요</h2>
      <img className="preview" src={dataUrl} alt="공유 카드 미리보기" />
      <button className="btn primary block" onClick={share}>공유하기</button>
      <button className="btn ghost block" onClick={save}>이미지 저장</button>
      <button className="btn ghost block" onClick={copy}>링크 복사</button>
      {toast && <div className="toast" role="status">{toast}</div>}
    </section>
  );
}
