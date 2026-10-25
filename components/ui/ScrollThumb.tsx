'use client';

import { useEffect, useRef } from 'react';

/** A14 — slim custom scroll indicator on the right edge; fades in while scrolling (opacity .35s). */
export function ScrollThumb() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let hideTimer = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      el.style.transform = `translate3d(0, ${progress * (window.innerHeight - el.offsetHeight - 16) + 8}px, 0)`;
      el.style.opacity = '1';
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => (el.style.opacity = '0'), 900);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 right-[3px] z-[90] hidden h-32 w-[5px] rounded-full bg-ink/35 opacity-0 transition-opacity duration-[350ms] md:block"
    />
  );
}
