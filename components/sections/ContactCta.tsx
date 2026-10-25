import { contactCta } from '@/src/content';
import { ButtonLink } from '@/components/ui/Button';
import { Ring } from '@/components/ui/Ring';

/** Contact CTA (reference y 4276–5311 @1440): huge serif heading, rotating 3D ring, subtitle + button. */
export function ContactCta() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="gutter overflow-x-clip pt-16 pb-[6.6rem] text-center max-[479px]:pt-12 max-[479px]:pb-14">
      <h2 id="cta-title" data-reveal className="t-huge mx-auto max-w-[60rem]">
        {contactCta.heading}
      </h2>
      <Ring panels={contactCta.ring} />
      <p data-reveal className="mx-auto mt-[4.5rem] text-[2rem] leading-none font-bold tracking-[-0.02em] min-[480px]:text-[3rem] max-[479px]:mt-10">
        {contactCta.subheading}
      </p>
      <ButtonLink href={contactCta.cta.href} className="mt-8 w-full min-[480px]:w-auto">
        {contactCta.cta.label}
      </ButtonLink>
    </section>
  );
}
