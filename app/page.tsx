import { MotionProvider } from '@/lib/animations/MotionProvider';
import { Nav } from '@/components/sections/Nav';
import { Hero } from '@/components/sections/Hero';
import { CaseStudies } from '@/components/sections/CaseStudies';
import { ResearchIntro } from '@/components/sections/ResearchIntro';
import { Articles } from '@/components/sections/Articles';
import { Services } from '@/components/sections/Services';
import { Testimonials } from '@/components/sections/Testimonials';
import { ContactCta } from '@/components/sections/ContactCta';
import { Footer } from '@/components/sections/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollThumb } from '@/components/ui/ScrollThumb';

export default function Home() {
  return (
    <MotionProvider>
      <Nav />
      <main id="main" tabIndex={-1} className="pt-[8.6rem] outline-none max-[479px]:pt-[8.55rem]">
        <Hero />
        <CaseStudies />
        <ResearchIntro />
        <Articles />
        <Services />
        <Testimonials />
        <ContactCta />
      </main>
      <Footer />
      <CustomCursor />
      <ScrollThumb />
    </MotionProvider>
  );
}
