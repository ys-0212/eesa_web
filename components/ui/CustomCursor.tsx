'use client';

import { useEffect, useRef } from 'react';
import { CursorArrow } from './icons';

/**
 * A5 — the "YOU" multiplayer-style pointer that replaces the system cursor on fine pointers.
 * Disabled for touch, coarse pointers and prefers-reduced-motion (system cursor stays).
 */
export function CustomCursor({ label = 'You' }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduced.matches || !ref.current) return;
    const el = ref.current;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    const move = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      el.style.opacity = '1';
    };
    const leave = () => (el.style.opacity = '0');
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[200] opacity-0 will-change-transform">
      <CursorArrow className="-translate-x-[2px] -translate-y-[2px] text-signal" />
      <span className="t-mono absolute top-[1.1rem] left-[1.25rem] rounded-[0.2rem] bg-signal px-2 py-[0.3rem] text-[0.875rem] text-[#f5f2f1]">
        {label}
      </span>
    </div>
  );
}
