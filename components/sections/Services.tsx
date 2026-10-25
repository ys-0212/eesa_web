'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { services } from '@/src/content';
import { Plus } from '@/components/ui/icons';

/**
 * Services (reference y 2711–3697 @1440). A8: horizontally draggable track whose cards are
 * a third of the content width minus 24px gaps (368×505 @1440), bleeding off the right edge.
 * Native scrolling + snap keeps touch, trackpad and keyboard working; mouse drag is added on top.
 */
export function Services() {
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, moved: false, x: 0, left: 0 });

  return (
    <section id="services" aria-labelledby="services-title" className="pt-[4.6rem] pb-16">
      <div className="gutter">
        <div className="min-[992px]:max-w-[61.5%]">
          <p data-reveal className="t-eyebrow">
            {services.eyebrow}
          </p>
          <h2 id="services-title" data-reveal className="t-display mt-2">
            {services.heading}
          </h2>
          <p data-reveal className="t-lead mt-4">
            {services.lead}
          </p>
        </div>
      </div>

      <ul
        ref={track}
        aria-label="Services — scroll horizontally"
        tabIndex={0}
        className="no-scrollbar mt-12 flex cursor-grab snap-x snap-mandatory scroll-px-[var(--gutter)] gap-6 overflow-x-auto overscroll-x-contain px-[var(--gutter)] select-none active:cursor-grabbing"
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || !track.current) return;
          drag.current = { active: true, moved: false, x: e.clientX, left: track.current.scrollLeft };
          track.current.style.scrollSnapType = 'none';
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.active || !track.current) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          track.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          drag.current.active = false;
          if (track.current) track.current.style.scrollSnapType = '';
        }}
        onPointerLeave={() => {
          drag.current.active = false;
          if (track.current) track.current.style.scrollSnapType = '';
        }}
        onClickCapture={(e) => {
          // A drag that ends over a card must not also follow its link.
          if (drag.current.moved) {
            e.preventDefault();
            drag.current.moved = false;
          }
        }}
      >
        {services.items.map((s) => (
          <li key={s.title} className="w-[calc((100vw-2*var(--gutter))*0.9)] shrink-0 snap-start min-[480px]:w-[calc((100vw-2*var(--gutter)-3rem)/3)]">
            <a href={s.href} draggable={false} className="group relative block aspect-[368/505] overflow-hidden rounded-[0.25rem] text-on-media">
              <Image
                src={s.image.src}
                alt={s.image.alt}
                fill
                draggable={false}
                sizes="(min-width: 480px) 26vw, 82vw"
                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                loading="lazy"
              />
              <span className="absolute inset-x-8 bottom-8 flex items-end justify-between gap-4 max-[767px]:inset-x-[1.9rem]">
                <span className="t-card-title max-w-[15.5rem]">{s.title}</span>
                <span className="grid size-10 shrink-0 place-items-center rounded-[0.25rem] bg-accent-soft text-[#06110e] transition-colors duration-200 group-hover:bg-accent group-hover:text-[#f5f2f1]">
                  <Plus />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
