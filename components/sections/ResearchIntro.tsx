import { research } from '@/src/content';
import { EmailForm } from '@/components/ui/EmailForm';

/** Research log intro (reference y 1611–1959 @1440): heading + lead left, newsletter right. */
export function ResearchIntro() {
  return (
    <section id="research" aria-labelledby="research-title" className="gutter pt-[4.6rem] pb-4">
      <div className="flex flex-col gap-10 min-[992px]:flex-row min-[992px]:items-end min-[992px]:justify-between">
        <div className="min-[992px]:max-w-[61.5%]">
          <p data-reveal className="t-eyebrow">
            {research.eyebrow}
          </p>
          <h2 id="research-title" data-reveal className="t-display mt-2">
            {research.heading}
          </h2>
          <p data-reveal className="t-lead mt-4">
            {research.lead}
          </p>
        </div>
        <div className="min-[992px]:mb-1 min-[992px]:w-[22.5rem]">
          <p data-reveal className="t-eyebrow text-[0.875rem] text-accent dark:text-accent-soft">
            {research.newsletter.eyebrow}
          </p>
          <EmailForm
            {...research.newsletter}
            variant="soft"
            className="mt-4 flex-col min-[480px]:flex-row"
            inputClassName="w-full min-[480px]:flex-1"
            buttonClassName="w-full min-[480px]:w-[8.6rem]"
          />
        </div>
      </div>
    </section>
  );
}
