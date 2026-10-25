'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { hero } from '@/src/content';
import { EmailForm } from '@/components/ui/EmailForm';
import { CursorArrow } from '@/components/ui/icons';
import { getGsap, prefersReducedMotion } from '@/lib/animations/gsap';

/**
 * Hero (reference y 144–745 @1440): centred serif H1 with a Figma-style selection box,
 * a looping collaborator cursor (A4), a pulsing location pin (A6), lead, badge row and email form.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const collaborator = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = collaborator.current;
    const section = root.current;
    if (!el || !section || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    // Waypoints are fractions of the hero box, traced from the reference recording.
    const points = [
      [0.06, 0.37],
      [0.13, 0.42],
      [0.2, 0.31],
      [0.1, 0.25],
    ];
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, defaults: { duration: 2.2, ease: 'power1.inOut' } });
      points.forEach(([x, y]) => tl.to(el, { left: `${x * 100}%`, top: `${y * 100}%` }, '+=0.6'));
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-title" className="gutter relative pt-[3rem] pb-16 text-center min-[480px]:pt-16">
      <h1 id="hero-title" data-reveal className="t-h1 mx-auto max-w-[47rem]">
        {hero.headingBefore}
        <span className="relative inline-block outline outline-1 -outline-offset-1 outline-chartreuse">{hero.headingHighlight}</span>
        {hero.headingAfter}
        <a href={hero.pinLink.href} aria-label={hero.pinLink.label} className="relative ml-[0.2em] inline-block h-[0.46em] w-[0.34em] align-[-0.02em]">
          <span aria-hidden className="pin-pulse absolute bottom-[-0.05em] left-1/2 h-[0.14em] w-[0.42em] rounded-[50%] bg-chartreuse/70" />
          <Image src={hero.pin.src} alt={hero.pin.alt} width={hero.pin.width} height={hero.pin.height} priority className="relative h-full w-full" />
        </a>
      </h1>

      {/* Collaborator cursor (decorative). */}
      <div
        ref={collaborator}
        aria-hidden
        className="pointer-events-none absolute top-[37%] left-[6%] z-10 hidden min-[992px]:block"
      >
        <CursorArrow className="absolute -top-5 left-[8.4rem] size-[1.4rem] -scale-x-100 text-chartreuse" />
        <span className="t-eyebrow flex items-center gap-1.5 rounded-[0.25rem] bg-chartreuse py-[0.2rem] pr-1.5 pl-2 text-[0.85rem] text-[#06110e]">
          {hero.collaboratorTag}
          <span className="flex -space-x-1.5">
            {hero.collaboratorAvatars.map((a) => (
              <Image key={a} src={a} alt="" width={18} height={18} className="size-[1.1rem] rounded-full border border-[#06110e]" />
            ))}
          </span>
        </span>
      </div>

      <p data-reveal className="t-lead mx-auto mt-4 max-w-[55rem]">
        {hero.lead}
      </p>

      <ul className="mx-auto mt-[4.3rem] flex max-w-[60rem] flex-col items-center gap-[0.85rem] min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:justify-center min-[480px]:gap-x-4 min-[480px]:gap-y-3">
        {hero.badges.map((b) => (
          <li key={b.label} className="t-eyebrow flex items-center gap-2">
            <Image src={b.icon} alt="" width={24} height={24} className="size-6" />
            {b.label}
          </li>
        ))}
      </ul>

      <EmailForm
        {...hero.form}
        className="mx-auto mt-12 max-w-[36rem] flex-col min-[480px]:flex-row min-[480px]:justify-center"
        inputClassName="w-full min-[480px]:w-[25rem]"
        buttonClassName="w-full min-[480px]:w-auto min-[480px]:px-[1.6rem]"
      />
    </section>
  );
}
