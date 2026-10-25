'use client';

import { getGsap } from './gsap';

/**
 * A1 — line-by-line text reveal, matching the reference's 77 ScrollTriggers:
 * lines masked, from y:100%, duration .6, power2.out, stagger .1, start "top 95%", played once.
 * Targets every element carrying `data-reveal`.
 */
export function initReveals(reduced: boolean) {
  const { gsap, ScrollTrigger, SplitText } = getGsap();
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (reduced) {
    targets.forEach((el) => el.classList.add('is-revealed'));
    return () => {};
  }

  document.documentElement.classList.add('js-reveal');
  const splits: InstanceType<typeof SplitText>[] = [];
  const triggers: ScrollTrigger[] = [];

  for (const el of targets) {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'reveal-line', autoSplit: false });
    split.masks.forEach((m) => (m as HTMLElement).classList.add('reveal-line-mask'));
    splits.push(split);
    gsap.set(split.lines, { yPercent: 100 });
    el.classList.add('is-revealed');
    const tween = gsap.to(split.lines, { yPercent: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1, paused: true });
    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: 'top 95%',
        once: true,
        onEnter: () => tween.play(),
      }),
    );
  }

  return () => {
    triggers.forEach((t) => t.kill());
    splits.forEach((s) => s.revert());
    document.documentElement.classList.remove('js-reveal');
  };
}
