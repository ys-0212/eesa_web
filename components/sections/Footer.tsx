import Image from 'next/image';
import { footer } from '@/src/content';
import { EmailForm } from '@/components/ui/EmailForm';
import { Wordmark } from '@/components/ui/Wordmark';
import { ChevronRight, Globe, Heart } from '@/components/ui/icons';

/** Footer (reference y 5311–6238 @1440): newsletter + badges, 5 link columns, location row, full-bleed wordmark. */
export function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden pt-[4.6rem]">
      <div className="gutter">
        <div className="flex flex-col gap-14 min-[992px]:flex-row min-[992px]:justify-between">
          <div>
            <p className="t-mono text-accent dark:text-accent-soft">{footer.newsletter.eyebrow}</p>
            <EmailForm
              {...footer.newsletter}
              variant="soft"
              className="mt-[1.1rem] flex-col min-[480px]:flex-row"
              inputClassName="w-full min-[480px]:w-[12.5rem]"
              buttonClassName="w-full min-[480px]:w-[8.6rem]"
            />
            <ul className="mt-[5.6rem] flex gap-4 max-[991px]:hidden">
              {footer.badges.map((b) => (
                <li key={b.src}>
                  <a href={b.href} className="block">
                    <Image src={b.src} alt={b.alt} width={112} height={112} className="size-[7rem]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid gap-x-4 gap-y-10 min-[480px]:grid-cols-3 min-[480px]:gap-y-[3.2rem] min-[992px]:w-[38.75rem]">
            {footer.columns.map((col) => (
              <div key={col.heading}>
                <p className="t-mono leading-[1.5] text-accent dark:text-accent-soft">{col.heading}</p>
                <ul className="mt-[0.9rem] space-y-[0.8rem]">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="t-mono inline-flex items-center gap-2 leading-[1.5] transition-colors duration-200 hover:text-accent-ink">
                        {l.label}
                        <ChevronRight className="size-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="t-mono mt-[3.5rem] flex items-center justify-between">
          <p className="flex items-center gap-2">
            <Heart /> {footer.location}
          </p>
          <p className="flex items-center gap-2">
            {footer.reach} <Globe />
          </p>
        </div>

        <ul className="mt-12 flex gap-4 min-[992px]:hidden">
          {footer.badges.map((b) => (
            <li key={b.src}>
              <a href={b.href} className="block">
                <Image src={b.src} alt={b.alt} width={107} height={107} className="size-[6.7rem]" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-2">
        <Wordmark fill className="block h-auto w-full translate-y-[6%]" />
        <Image
          src={footer.mascot.src}
          alt={footer.mascot.alt}
          width={footer.mascot.width}
          height={footer.mascot.height}
          className="absolute right-[17%] bottom-0 w-[4.8rem] min-[480px]:w-[6.6rem]"
        />
      </div>
    </footer>
  );
}
