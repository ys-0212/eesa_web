'use client';

import { useEffect, useRef } from 'react';
import { getGsap, prefersReducedMotion } from '@/lib/animations/gsap';

/**
 * Subtle scroll parallax for media inside overflow-hidden frames (the reference's case-study images
 * are ~3% taller than their cards). Disabled under prefers-reduced-motion.
 */
export function Parallax({ children, className = '', amount = 3 }: { children: React.ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const tween = gsap.fromTo(
      el,
      { yPercent: -amount },
      { yPercent: amount, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
