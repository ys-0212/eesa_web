/**
 * All editable copy, links, alt text and media references for the landing page, grouped by section.
 *
 * The layout reproduces greaterstudio.com, but every piece of copy below is ORIGINAL PLACEHOLDER
 * text (fictional clients, people and metrics) written to match the reference's line lengths.
 * Replace it with your own content. Media paths point into /public/media — drop in a new file
 * with the same aspect ratio (noted per field) and update the path here.
 */

export type Link = { label: string; href: string };
export type Media = { src: string; alt: string; width: number; height: number };

export const site = {
  title: 'Home | Greater',
  description: 'A brand and experience design partner for teams that move fast. (Placeholder description.)',
  brand: 'Greater',
  /** Optional SVG/PNG logo. When null the wordmark is set in the script display face. */
  logo: null as Media | null,
};

export const nav = {
  links: [
    { label: 'Research', href: '#research' },
    { label: 'Work', href: '#work' },
    { label: 'B&A', href: '#work' },
  ] satisfies Link[],
  cta: { label: 'Contact', href: '#contact' } satisfies Link,
  themeToggleLabel: 'Toggle dark mode',
  menuOpenLabel: 'Open menu',
  menuCloseLabel: 'Close menu',
};

export const menu = {
  searchPlaceholder: 'Search',
  primary: [
    { label: 'Work', href: '#work' },
    { label: 'Research', href: '#research' },
    { label: 'Before & After', href: '#work' },
    { label: 'About', href: '#services' },
    { label: 'Shop', href: '#footer' },
    { label: 'Contact', href: '#contact' },
  ] satisfies Link[],
  secondary: [
    { label: 'Platform partner', href: '#footer' },
    { label: 'Design community', href: '#footer' },
  ] satisfies Link[],
};

export const hero = {
  /** The word wrapped in the Figma-style selection box must appear verbatim in `headingBefore/After` split. */
  headingBefore: 'A design ',
  headingHighlight: 'partner',
  headingAfter: ' built for what comes next',
  lead:
    'We shape the brand and product systems that power your launches, stories, and screens. Flexible enough to evolve with every market shift, steady enough to let your team finally breathe.',
  collaboratorTag: 'Greater',
  collaboratorAvatars: ['/media/avatars/avatar-1.svg', '/media/avatars/avatar-2.svg'],
  pin: { src: '/media/hero/pin.svg', alt: '', width: 172, height: 232 } satisfies Media,
  pinLink: { label: 'Meet the studio mascot', href: '#footer' } satisfies Link,
  badges: [
    { label: 'Enterprise platform partner', icon: '/media/icons/badge-1.svg' },
    { label: 'Select design agency', icon: '/media/icons/badge-2.svg' },
    { label: 'AI workflow certified', icon: '/media/icons/badge-3.svg' },
    { label: 'AI code studio', icon: '/media/icons/badge-4.svg' },
  ],
  form: { placeholder: 'Your email', submit: 'Get in touch', label: 'Email address' },
};

export const caseStudies = {
  cards: [
    {
      status: 'Active',
      since: 'Since 2021',
      client: 'Northlight',
      title: 'How a civic arts festival doubled its reach in one season.',
      stat: '+128.4%',
      statLabel: 'Growth in site users',
      href: '#work',
      image: { src: '/media/cases/case-1.svg', alt: 'Abstract illustration of a gallery floor plan with a sweeping orange line', width: 1440, height: 1080 },
    },
    {
      status: 'Acquired',
      since: '3 year partnership',
      client: 'Fieldwork',
      title: 'A fintech founder on the path from pre-seed to acquisition',
      stat: '412%',
      statLabel: 'growth in monthly content',
      href: '#work',
      image: { src: '/media/cases/case-2.svg', alt: 'Illustrated phone showing an article layout on an olive textured background', width: 1440, height: 1513 },
    },
  ],
  stats: [
    { value: 650, prefix: '$', suffix: 'M+', label: 'raised by our client partners' },
    { value: 9, prefix: '', suffix: '+', label: 'years growing brands' },
    { value: 36, prefix: '', suffix: '+', label: 'months of median partnership' },
    { value: 1000, prefix: '', suffix: 's', label: 'of collaborative design projects' },
  ],
};

export const research = {
  eyebrow: 'Research log',
  heading: 'Shifting markets? Unsure of what comes next?',
  lead: 'Notes and experiments from our studio so you can walk into every meeting as the most prepared person in the room.',
  newsletter: { eyebrow: 'Subscribe to our newsletter', placeholder: 'Your email', submit: 'Subscribe', label: 'Newsletter email' },
};

export const articles = {
  items: [
    {
      number: 'No. 00024',
      /** Colour of the issue number printed over the artwork. */
      tone: 'dark' as 'dark' | 'light',
      type: 'Article',
      date: 'September 4, 2026',
      title: 'What search engines now expect from AI-ready content',
      excerpt: null as string | null,
      author: { name: 'Rowan Ellis', avatar: '/media/avatars/avatar-1.svg' },
      href: '#research',
      image: { src: '/media/articles/article-1.svg', alt: 'Cursor pointing at a label reading AI-ready content checklist', width: 1800, height: 1200 },
    },
    {
      number: 'No. 00023',
      tone: 'light' as 'dark' | 'light',
      type: 'Article',
      date: 'August 19, 2026',
      title: 'Questions worth asking before you hire a creative partner',
      excerpt: 'Choose the team that rethinks the problem with you, not one that only polishes the surface.',
      author: { name: 'Rowan Ellis', avatar: '/media/avatars/avatar-1.svg' },
      href: '#research',
      image: { src: '/media/articles/article-2.svg', alt: 'Pink cursor next to a label reading ask before you sign a partner', width: 1800, height: 1200 },
    },
    {
      number: 'No. 00022',
      tone: 'light' as 'dark' | 'light',
      type: 'Article',
      date: 'August 9, 2026',
      title: 'Our studio lands on two agency shortlists for 2026',
      excerpt: null as string | null,
      author: { name: 'Jules Okafor', avatar: '/media/avatars/avatar-2.svg' },
      href: '#research',
      image: { src: '/media/articles/article-3.svg', alt: 'Blue court illustration with the words Shortlist and Studio', width: 1800, height: 1200 },
    },
  ],
  more: { label: 'View more +', href: '#research' } satisfies Link,
};

export const services = {
  eyebrow: 'Our services',
  heading: 'Design partnership that adapts as you grow',
  lead: 'Focused creative services for every stage of the journey. From the first sprint to the fourth year, we build partnerships that turn bold plans into shipped work.',
  /** Card artwork is 636×848 (3:4). */
  items: [
    'Brand Starter', 'Brand Transformation', 'Embedded Brand Team', 'Content System', 'Promo Videos',
    'Embedded Content Team', 'Site Migration', 'Component Libraries', 'Custom Website', 'MVP Build',
    'Transformation Sprint', 'Embedded Product Team', 'CRO Program',
  ].map((title, i) => ({
    title,
    href: '#services',
    image: { src: `/media/services/service-${String(i + 1).padStart(2, '0')}.svg`, alt: '', width: 636, height: 848 },
  })),
};

export const testimonials = {
  eyebrow: 'From our clients',
  prevLabel: 'Previous testimonial',
  nextLabel: 'Next testimonial',
  /** Portraits are square (1:1). All people, companies and quotes below are fictional placeholders. */
  items: [
    {
      quote:
        '"Partnering with this team changed how we ship. They rebuilt our marketing site end to end, from the positioning workshop to the last line of production code. It never felt like hiring an agency; it felt like adding senior people to our own team who cared about every detail. I recommend them without hesitation."',
      name: 'Avery Lin',
      role: 'Co-founder & Head of Product',
      company: 'Brightloop',
      stat: '312%',
      statLabel: 'growth in demo requests',
      portrait: { src: '/media/people/person-1.svg', alt: 'Placeholder portrait for Avery Lin', width: 1440, height: 1440 },
    },
    {
      quote:
        '"We came in with a half-finished rebrand, a site nobody wanted to touch and a launch date that would not move. Within two weeks they had untangled the strategy, rewritten the story and set up a design system our engineers actually enjoy using. Every review was candid and fast, every decision was explained, and the result looks like the company we always wanted to be. Our sales team now sends the website first instead of a deck, and the numbers since launch speak for themselves."',
      name: 'Theo Marsh',
      role: 'CEO',
      company: 'Parcel Nine',
      stat: '3.1x',
      statLabel: 'more qualified pipeline',
      portrait: { src: '/media/people/person-2.svg', alt: 'Placeholder portrait for Theo Marsh', width: 1440, height: 1440 },
    },
    {
      quote:
        '"They took a messy brief and turned it into a system our whole company now uses. Weekly reviews were sharp, honest and fast, and the launch landed on time."',
      name: 'Maya Kerr',
      role: 'VP Marketing',
      company: 'Atlas Row',
      stat: '2.4x',
      statLabel: 'faster page production',
      portrait: { src: '/media/people/person-2.svg', alt: 'Placeholder portrait for Maya Kerr', width: 1440, height: 1440 },
    },
    {
      quote:
        '"The embedded team model was exactly what we needed: design, content and development moving together instead of waiting on each other."',
      name: 'Sam Rivera',
      role: 'Founder',
      company: 'Northlight',
      stat: '128%',
      statLabel: 'growth in site users',
      portrait: { src: '/media/people/person-3.svg', alt: 'Placeholder portrait for Sam Rivera', width: 1440, height: 1440 },
    },
    {
      quote:
        '"Our migration was the smoothest project of the year. Nothing broke, traffic held, and the new component library made the team twice as quick."',
      name: 'Dana Voss',
      role: 'Director of Growth',
      company: 'Fieldwork',
      stat: '0',
      statLabel: 'ranking losses after launch',
      portrait: { src: '/media/people/person-4.svg', alt: 'Placeholder portrait for Dana Voss', width: 1440, height: 1440 },
    },
    {
      quote:
        '"Clear thinking, beautiful craft and zero ego. They pushed us when we needed it and made the whole process genuinely fun."',
      name: 'Noor Bakri',
      role: 'Chief Brand Officer',
      company: 'Kiln & Co',
      stat: '64%',
      statLabel: 'lift in conversion rate',
      portrait: { src: '/media/people/person-5.svg', alt: 'Placeholder portrait for Noor Bakri', width: 1440, height: 1440 },
    },
  ],
};

export const contactCta = {
  heading: 'Reach higher, build forever.',
  subheading: 'Tell us about your next project.',
  cta: { label: 'Contact us', href: '#contact' } satisfies Link,
  /** Ring panels are 600×460. */
  ring: Array.from({ length: 8 }, (_, i) => ({ src: `/media/ring/panel-${i + 1}.svg`, alt: '', width: 600, height: 460 })),
};

export const footer = {
  newsletter: { eyebrow: 'Subscribe to our newsletter', placeholder: 'Your email', submit: 'Subscribe', label: 'Footer newsletter email' },
  badges: [
    { src: '/media/badges/badge-1.svg', alt: 'Certified partner badge (placeholder)', width: 453, height: 453, href: '#footer' },
    { src: '/media/badges/badge-2.svg', alt: 'Select studio badge (placeholder)', width: 453, height: 453, href: '#footer' },
  ],
  columns: [
    { heading: 'Our work', links: [{ label: 'Before & After', href: '#work' }, { label: 'Partnership', href: '#work' }] },
    { heading: 'Company', links: [{ label: 'About us', href: '#services' }, { label: 'Studio hours', href: '#footer' }] },
    {
      heading: 'Services',
      links: [
        { label: 'Brand starter', href: '#services' }, { label: 'Web design system', href: '#services' },
        { label: 'CRO', href: '#services' }, { label: 'Site migration', href: '#services' }, { label: 'Web development', href: '#services' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Research', href: '#research' }, { label: 'FAQs', href: '#footer' },
        { label: 'Site log', href: '#footer' }, { label: 'Gallery', href: '#footer' },
      ],
    },
    {
      heading: 'Social',
      links: [
        { label: 'Instagram', href: 'https://www.instagram.com/' }, { label: 'Dribbble', href: 'https://dribbble.com/' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
      ],
    },
  ] satisfies { heading: string; links: Link[] }[],
  location: 'New York',
  reach: 'Worldwide',
  mascot: { src: '/media/mascot.svg', alt: 'Pip, the studio mascot, peeking over the wordmark', width: 105, height: 143 },
};
