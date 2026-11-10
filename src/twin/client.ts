/**
 * Twin client: wires the 2D hotspots to the shared card popover, and upgrades to the
 * 3D layer when it is near the viewport and the browser/device can handle it.
 * The 2D layer is always there underneath as the fallback.
 */
import { createPopover, rectOf } from './popover';
import type { TwinData } from './sceneData';
import type { Twin3D } from './twin3d';

const PREF = 'twin-view';

function canRun3D() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) < 4 || (navigator.hardwareConcurrency ?? 4) < 4) return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

function readPref() {
  try {
    return localStorage.getItem(PREF);
  } catch {
    return null;
  }
}
function writePref(v: '2d' | '3d') {
  try {
    localStorage.setItem(PREF, v);
  } catch {
    /* storage blocked: preference lasts for this page only */
  }
}

export function initTwin(root: HTMLElement) {
  const stage2d = root.querySelector<HTMLElement>('[data-stage]')!;
  const stage3d = root.querySelector<HTMLElement>('[data-stage3d]')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-view]')!;
  const appPick = root.querySelector<HTMLElement>('[data-app]')!;
  const appSelect = appPick.querySelector('select')!;
  const hint2d = root.querySelector<HTMLElement>('[data-hint2d]');
  const hint3d = root.querySelector<HTMLElement>('[data-hint3d]');
  const labels = root.querySelector<HTMLInputElement>('#twin-labels')!;
  const planned = root.querySelector<HTMLInputElement>('#twin-planned')!;
  const volume = root.querySelector<HTMLInputElement>('#twin-volume')!;
  const popover = createPopover(root, stage2d);

  // ---- 2D hotspots ------------------------------------------------------------------
  const hotspots = [...root.querySelectorAll<SVGAElement>('a.hot')];
  const names = new Map(hotspots.map((a) => [a.dataset.device!, a.getAttribute('aria-label') ?? '']));
  for (const a of hotspots) {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.dataset.device!;
      if (popover.current === id) popover.close();
      else popover.open(id, rectOf(a), a, names.get(id) ?? '');
    });
  }
  popover.onChange((id) => hotspots.forEach((a) => a.classList.toggle('is-active', a.dataset.device === id)));
  planned.addEventListener('change', () => {
    if (!planned.checked && popover.current && root.querySelector(`a.hot.s-planned[data-device="${popover.current}"]`)) popover.close(false);
  });
  addEventListener('resize', () => {
    const a = hotspots.find((h) => h.dataset.device === popover.current);
    if (a && !stage2d.hidden) popover.place(rectOf(a));
  });
  // Narrow screens: the map is wider than the viewport, so start it centred.
  const scroller = root.querySelector<HTMLElement>('.scroller');
  if (scroller && scroller.scrollWidth > scroller.clientWidth) scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;

  // ---- 3D upgrade -------------------------------------------------------------------
  if (!canRun3D()) return;
  const data: TwinData = JSON.parse(root.closest('section')!.querySelector('script[data-twin-json]')!.textContent!);
  let twin: Twin3D | null = null;
  let loading: Promise<void> | null = null;

  const show = (mode: '2d' | '3d') => {
    popover.close(false);
    const is3d = mode === '3d' && !!twin;
    stage2d.hidden = is3d;
    stage3d.hidden = !is3d;
    appPick.hidden = !is3d;
    if (hint2d) hint2d.hidden = is3d;
    if (hint3d) hint3d.hidden = !is3d;
    popover.mount(is3d ? stage3d : stage2d);
    toggle.setAttribute('aria-pressed', String(is3d));
    toggle.textContent = is3d ? toggle.dataset.label2d! : toggle.dataset.label3d!;
    root.classList.toggle('is-3d', is3d);
  };

  const fail = () => {
    twin?.destroy();
    twin = null;
    toggle.hidden = true;
    show('2d');
  };

  const load = () =>
    (loading ??= import('./twin3d')
      .then(({ mount3D }) => {
        stage3d.hidden = false; // needs a size before the renderer measures it
        twin = mount3D({ host: stage3d, data, popover, names, onFail: fail });
        if (!twin) return fail();
        twin.setLabels(labels.checked);
        twin.setPlanned(planned.checked);
        twin.setVolume(volume.checked);
      })
      .catch(fail));

  toggle.hidden = false;
  toggle.addEventListener('click', async () => {
    const want3d = !root.classList.contains('is-3d');
    writePref(want3d ? '3d' : '2d');
    if (want3d) await load();
    show(want3d ? '3d' : '2d');
  });
  labels.addEventListener('change', () => twin?.setLabels(labels.checked));
  planned.addEventListener('change', () => twin?.setPlanned(planned.checked));
  volume.addEventListener('change', () => twin?.setVolume(volume.checked));
  appSelect.addEventListener('change', () => twin?.setApplication(appSelect.value || null));
  show('2d');

  if (readPref() === '2d') return;
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      // Wait for an idle moment so loading Three.js never competes with scrolling or the hero.
      const go = () => load().then(() => twin && show('3d'));
      'requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 200);
    },
    { threshold: 0.15 },
  );
  io.observe(root);
}
