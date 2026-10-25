'use client';

import { getGsap } from './gsap';

/**
 * A7 — counts `[data-countup]` numbers from 0 to their value when they scroll into view.
 * The element's text content stays the final value for no-JS / reduced motion.
 */
export function initCountUps(reduced: boolean) {
  const { gsap, ScrollTrigger } = getGsap();
  if (reduced) return () => {};
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-countup]'));
  const triggers = els.map((el) => {
    const target = Number(el.dataset.countup);
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';
    const state = { v: 0 };
    const render = () => (el.textContent = `${prefix}${Math.round(state.v)}${suffix}`);
    render();
    return ScrollTrigger.create({
      trigger: el,
      start: 'top 95%',
      once: true,
      onEnter: () => gsap.to(state, { v: target, duration: 1.6, ease: 'power2.out', onUpdate: render }),
    });
  });
  return () => triggers.forEach((t) => t.kill());
}
