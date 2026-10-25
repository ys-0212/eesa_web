import Image from 'next/image';
import { articles } from '@/src/content';
import { ButtonLink } from '@/components/ui/Button';

/** Research articles grid (reference y 1959–2711 @1440): 3 cols ≥1280, 2 cols ≥480, 1 col below. */
export function Articles() {
  return (
    <section aria-label="Latest research" className="gutter pt-16 pb-16">
      <ul className="grid gap-x-4 gap-y-12 min-[480px]:grid-cols-2 min-[1280px]:grid-cols-3">
        {articles.items.map((a) => (
          <li key={a.number}>
            <a href={a.href} className="group block">
              <span className="relative block aspect-[3/2] overflow-hidden rounded-[0.25rem]">
                <Image
                  src={a.image.src}
                  alt={a.image.alt}
                  fill
                  sizes="(min-width: 1280px) 26vw, (min-width: 480px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <span className={`t-eyebrow absolute top-3 left-3 text-[0.8rem] ${a.tone === 'dark' ? 'text-[#06110e]' : 'text-[#f5f2f1]'}`}>{a.number}</span>
              </span>
              <span className="mt-4 flex items-center gap-2">
                <span className="t-eyebrow rounded-[0.15rem] border border-disabled bg-panel px-2 py-[0.2rem]">{a.type}</span>
                <span className="t-eyebrow">{a.date}</span>
              </span>
              <span data-reveal className="t-card-title mt-4 block pr-4 transition-colors duration-200 group-hover:text-accent-ink">
                {a.title}
              </span>
              {a.excerpt && (
                <span data-reveal className="mt-2 block text-[1rem] leading-[1.5] tracking-[-0.01em]">
                  {a.excerpt}
                </span>
              )}
              <span className="mt-5 flex items-center gap-2">
                <Image src={a.author.avatar} alt="" width={24} height={24} className="size-6 rounded-full" />
                <span className="t-eyebrow">{a.author.name}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex justify-center min-[480px]:mt-[4.1rem]">
        <ButtonLink href={articles.more.href} className="w-full min-[480px]:w-auto">
          {articles.more.label}
        </ButtonLink>
      </div>
    </section>
  );
}
