'use client';

import Lenis from 'lenis';
import { useEffect, useSyncExternalStore } from 'react';
import { getGsap, prefersReducedMotion } from './gsap';
import { initReveals } from './reveal';
import { initCountUps } from './countup';

// The Lenis instance lives outside React; components subscribe to it.
let current: Lenis | null = null;
const listeners = new Set<() => void>();
const setLenis = (next: Lenis | null) => {
  current = next;
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useLenis = () =>
  useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );

/**
 * A2 smooth scroll (Lenis, synced to the GSAP ticker so ScrollTrigger stays in step),
 * A1 text reveals and A7 count-ups. Everything is skipped under prefers-reduced-motion.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const reduced = prefersReducedMotion();
    let instance: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduced) {
      // Defaults mirror the reference's Lenis 0.2.x setup (lerp-based smoothing, wheel only).
      instance = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
      instance.on('scroll', ScrollTrigger.update);
      tick = (time: number) => instance?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);
    }

    let cleanupReveals = () => {};
    let cleanupCounts = () => {};
    let cancelled = false;
    // Wait for web fonts so SplitText measures final line breaks.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      cleanupReveals = initReveals(reduced);
      cleanupCounts = initCountUps(reduced);
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      cleanupReveals();
      cleanupCounts();
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      setLenis(null);
    };
  }, []);

  return children;
}
