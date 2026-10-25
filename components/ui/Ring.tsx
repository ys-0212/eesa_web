'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { Media } from '@/src/content';
import { prefersReducedMotion } from '@/lib/animations/gsap';

// Camera sits slightly below the ring (back panels show beneath the front ones, as on the reference).
const TILT = 8;
const transformFor = (angle: number) => `translateZ(calc(var(--ring-r) * -1)) rotateX(${TILT}deg) rotateY(${angle}deg)`;

/**
 * A10 — ring of panels on a cylinder, rotating continuously around Y (reference: Three.js r128 canvas).
 * Rebuilt with CSS 3D transforms; scrolling briefly speeds the spin up. Static under reduced motion.
 */
export function Ring({ panels }: { panels: Media[] }) {
  const ring = useRef<HTMLDivElement>(null);
  const step = 360 / panels.length;

  useEffect(() => {
    const el = ring.current;
    if (!el || prefersReducedMotion()) return;
    let angle = 0;
    let boost = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el.parentElement ?? el);
    const loop = () => {
      const y = window.scrollY;
      boost = Math.min(boost * 0.92 + Math.abs(y - lastY) * 0.02, 3);
      lastY = y;
      if (visible) {
        angle = (angle - (0.12 + boost)) % 360;
        el.style.transform = transformFor(angle);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="relative mx-auto mt-2 h-[13.5rem] w-full [--panel-h:8.6rem] [--panel-w:9.4rem] [--ring-r:11.4rem] [perspective:900px] min-[480px]:mt-0 min-[480px]:h-[27.8vw] min-[480px]:[--panel-h:20.4vw] min-[480px]:[--panel-w:22.6vw] min-[480px]:[--ring-r:27.4vw] min-[480px]:[perspective:139vw]"
    >
      <div ref={ring} className="absolute top-1/2 left-1/2 h-0 w-0 [transform-style:preserve-3d]" style={{ transform: transformFor(0) }}>
        {panels.map((p, i) => (
          <div
            key={p.src}
            className="absolute top-[calc(var(--panel-h)/-2)] left-[calc(var(--panel-w)/-2)] h-[var(--panel-h)] w-[var(--panel-w)] overflow-hidden"
            style={{ transform: `rotateY(${i * step}deg) translateZ(var(--ring-r))` }}
          >
            <Image src={p.src} alt={p.alt} fill sizes="22rem" className="object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}
