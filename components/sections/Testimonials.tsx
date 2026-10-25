'use client';

import Image from 'next/image';
import { useState } from 'react';
import { testimonials } from '@/src/content';
import { ChevronLeft, ChevronRight } from '@/components/ui/icons';

/**
 * A9 — testimonial slider (reference y 3697–4276 @1440): counter `[ i / N ]`, 40×40 arrows
 * (disabled #a0a29f at the ends, #9ab3eb otherwise), 310² grayscale portrait ≥992px.
 * All slides share one grid cell so the block is as tall as the tallest slide (Swiper behaviour)
 * and switching slides never shifts the page.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = testimonials.items.length;
  const arrow =
    'grid size-10 place-items-center rounded-[0.25rem] transition-[background-color,color,transform] duration-[250ms] enabled:bg-accent-soft enabled:text-[#06110e] enabled:hover:bg-accent enabled:hover:text-[#f5f2f1] disabled:bg-disabled disabled:text-[#6e6e6e]';

  return (
    <section aria-roledescription="carousel" aria-labelledby="testimonials-title" className="gutter pt-[7rem] pb-[1.75rem] max-[479px]:pt-16 max-[479px]:pb-10">
      <div className="flex items-center justify-between">
        <h2 id="testimonials-title" className="t-mono text-[0.875rem] tracking-[0.02em]">
          {testimonials.eyebrow}{' '}
          <span aria-live="polite">
            [ {index + 1} / {total} ]
          </span>
        </h2>
        <div className="flex gap-2">
          <button type="button" aria-label={testimonials.prevLabel} disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))} className={arrow}>
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label={testimonials.nextLabel}
            disabled={index === total - 1}
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            className={arrow}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="mt-12 grid overflow-x-clip [overflow-clip-margin:0.5rem]">
        {testimonials.items.map((t, i) => {
          const active = i === index;
          return (
            <figure
              key={t.name}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              aria-hidden={!active}
              inert={!active}
              className={`col-start-1 row-start-1 grid gap-4 transition-[opacity,transform] duration-300 ease-out min-[992px]:grid-cols-[19.375rem_1fr] ${
                active ? 'translate-x-0 opacity-100' : 'pointer-events-none invisible translate-x-6 opacity-0'
              }`}
            >
              <div className="relative hidden aspect-square self-start overflow-hidden rounded-[0.25rem] min-[992px]:block">
                <Image src={t.portrait.src} alt={t.portrait.alt} fill sizes="20rem" className="object-cover grayscale" loading="lazy" />
                <span className="absolute bottom-4 left-4 grid h-[4.5rem] w-[9rem] place-items-center rounded-[0.25rem] bg-violet text-[1.25rem] font-bold tracking-tight text-[#f5f2f1]">
                  {t.company}
                </span>
              </div>
              <div className="flex flex-col min-[992px]:min-h-[calc(19.375rem+2.6rem)]">
                <blockquote className="t-lead tracking-[-0.01em]">{t.quote}</blockquote>
                <figcaption className="mt-8 flex flex-col gap-6 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between min-[992px]:mt-auto">
                  <span className="t-mono text-[0.875rem] leading-[1.2]">
                    {t.name},
                    <br />
                    {t.role} <span className="mx-1">|</span> {t.company}
                  </span>
                  <span className="grid h-[4.3rem] w-[8.6rem] place-items-center rounded-[0.25rem] bg-violet text-[1.2rem] font-bold text-[#f5f2f1] min-[992px]:hidden">
                    {t.company}
                  </span>
                  <span className="block">
                    <span className="block text-[2.5rem] leading-none font-bold tracking-[-0.02em]">{t.stat}</span>
                    <span className="block text-[1rem] leading-[1.4] tracking-[-0.01em]">{t.statLabel}</span>
                  </span>
                </figcaption>
              </div>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
