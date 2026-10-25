import type { Metadata, Viewport } from 'next';
import { Figtree, Instrument_Serif, Space_Mono, Yellowtail } from 'next/font/google';
import { site } from '@/src/content';
import './globals.css';

// OFL stand-ins for the reference's licensed faces (see analysis/SPEC.md §2).
const display = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });
const body = Figtree({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const code = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-code', display: 'swap' });
const wordmark = Yellowtail({ subsets: ['latin'], weight: '400', variable: '--font-wordmark', display: 'swap' });

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2f1' },
    { media: '(prefers-color-scheme: dark)', color: '#06110e' },
  ],
};

// Applies the stored theme before first paint so there is no light/dark flash.
const themeBootstrap = `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${code.variable} ${wordmark.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <a
          href="#main"
          className="t-mono fixed top-3 left-3 z-[100] -translate-y-24 rounded bg-accent px-4 py-3 text-page transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
