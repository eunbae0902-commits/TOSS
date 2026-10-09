export type EventName =
  | 'view_splash' | 'view_category' | 'view_scenario' | 'view_generating' | 'view_result' | 'view_share'
  | 'select_category' | 'submit_scenario' | 'generate_parallel_world' | 'share_result' | 'save_image' | 'copy_link';

/** 앱인토스 Analytics SDK 연동 지점. 현재는 콘솔과 CustomEvent로만 내보낸다. */
export const track = (name: EventName, props: Record<string, string | number> = {}): void => {
  if (import.meta.env.DEV) console.debug('[analytics]', name, props);
  window.dispatchEvent(new CustomEvent('analytics', { detail: { name, props } }));
};
