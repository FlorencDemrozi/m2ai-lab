/**
 * The floating device card shared by the 2D and 3D twin layers. Cards are pre-rendered
 * DeviceCards in a <template data-cards>; opening one clones it into the popover.
 * Esc and the close button close it and return focus to whatever opened it.
 */
export type Anchor = { left: number; top: number; width: number; height: number };

export function createPopover(root: HTMLElement, stage: HTMLElement) {
  const pop = root.querySelector<HTMLElement>('[data-pop]')!;
  const slot = pop.querySelector<HTMLElement>('[data-slot]')!;
  const cards = root.closest('section')!.querySelector<HTMLTemplateElement>('template[data-cards]')!.content;
  let current: string | null = null;
  let returnTo: HTMLElement | SVGElement | null = null;
  const listeners = new Set<(id: string | null) => void>();

  // The popover lives in the active stage so it can be positioned relative to it.
  const mount = (host: HTMLElement) => {
    if (pop.parentElement !== host) host.append(pop);
  };

  function place(anchor: Anchor) {
    const s = pop.parentElement!.getBoundingClientRect();
    if (s.width < 640) {
      pop.classList.add('docked');
      pop.style.left = pop.style.top = '';
      return;
    }
    pop.classList.remove('docked');
    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;
    let left = anchor.left - s.left + anchor.width + 16;
    if (left + pw > s.width - 8) left = anchor.left - s.left - pw - 16;
    left = Math.max(8, Math.min(left, s.width - pw - 8));
    let top = anchor.top - s.top + anchor.height / 2 - ph / 2;
    top = Math.max(8, Math.min(top, s.height - ph - 8));
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
  }

  function close(restore = true) {
    if (!current) return;
    pop.hidden = true;
    slot.replaceChildren();
    current = null;
    listeners.forEach((f) => f(null));
    if (restore) returnTo?.focus();
    returnTo = null;
  }

  function open(id: string, anchor: Anchor, from: HTMLElement | SVGElement | null, label: string) {
    const card = cards.querySelector(`[data-card="${CSS.escape(id)}"]`);
    if (!card) return;
    current = id;
    returnTo = from;
    slot.replaceChildren(card.firstElementChild!.cloneNode(true));
    pop.setAttribute('aria-label', label);
    pop.hidden = false;
    place(anchor);
    pop.focus({ preventScroll: true });
    if (pop.classList.contains('docked')) pop.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    listeners.forEach((f) => f(id));
  }

  pop.querySelector('[data-close]')!.addEventListener('click', () => close());
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) {
      e.preventDefault();
      close();
    }
  });
  document.addEventListener('pointerdown', (e) => {
    const t = e.target as Element;
    if (current && !pop.contains(t) && !t.closest?.('[data-device]') && !t.closest?.('canvas')) close(false);
  });

  return {
    open,
    close,
    place,
    mount,
    get current() {
      return current;
    },
    /** Called with the open device id, or null when closed. */
    onChange: (f: (id: string | null) => void) => listeners.add(f),
  };
}
export type Popover = ReturnType<typeof createPopover>;

export const rectOf = (el: Element): Anchor => {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};
