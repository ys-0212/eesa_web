import Image from 'next/image';
import { caseStudies } from '@/src/content';
import { Parallax } from '@/components/ui/Parallax';

/**
 * Featured case studies + stats (reference y 745–1611 @1440).
 * Cards: 2 columns ≥992 (568×454, r 8), stacked squares below. Stats: number | label rows with rules.
 */
export function CaseStudies() {
  return (
    <section id="work" aria-label="Featured work" className="gutter pb-[4.6rem]">
      <div className="grid gap-4 min-[992px]:grid-cols-2">
        {caseStudies.cards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            className="group relative block aspect-square overflow-hidden rounded-[0.5rem] text-on-media min-[992px]:aspect-[568/454]"
          >
            <Parallax className="absolute inset-0 -top-[3%] -bottom-[3%]">
              <Image
                src={c.image.src}
                alt={c.image.alt}
                fill
                sizes="(min-width: 992px) 40vw, 90vw"
                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
              />
            </Parallax>
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <span className="t-mono absolute top-4 left-4 rounded-full bg-pink px-4 py-2 text-[#06110e] min-[480px]:top-12 min-[480px]:left-12">
              {c.status} <span className="mx-1">|</span> {c.since}
            </span>
            <span className="absolute inset-x-4 bottom-4 flex flex-col gap-4 min-[480px]:inset-x-12 min-[480px]:bottom-[2.6rem] min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between">
              <span className="block min-[480px]:w-[64%]">
                <span className="mb-3 block text-[1.25rem] font-bold tracking-tight">{c.client}</span>
                <span data-reveal className="block text-[1.5rem] leading-none font-bold tracking-[-0.01em] min-[480px]:text-[2rem]">
                  {c.title}
                </span>
              </span>
              <span className="block min-[480px]:text-right">
                <span className="block text-[1.5rem] leading-none font-bold min-[480px]:text-[2rem]">{c.stat}</span>
                <span className="mt-2 block text-[0.875rem] leading-[1.6] font-semibold">{c.statLabel}</span>
              </span>
            </span>
          </a>
        ))}
      </div>

      <dl className="mt-8 grid gap-x-4 min-[480px]:mt-[3.6rem] min-[992px]:grid-cols-2">
        {caseStudies.stats.map((s) => (
          <div key={s.label} className="grid items-end gap-x-4 border-b border-rule py-[1.9rem] min-[480px]:grid-cols-2 min-[480px]:py-[2.35rem]">
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-[1.875rem] leading-[1.16] min-[480px]:text-[3.5rem]" aria-hidden>
              <span data-countup={s.value} data-prefix={s.prefix} data-suffix={s.suffix}>
                {s.prefix}
                {s.value}
                {s.suffix}
              </span>
            </dd>
            <dd className="pb-1 text-[1.25rem] leading-[1.5]">
              <span className="sr-only">
                {s.prefix}
                {s.value}
                {s.suffix}{' '}
              </span>
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
