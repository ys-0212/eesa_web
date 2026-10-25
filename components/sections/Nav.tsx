'use client';

import { useEffect, useRef, useState } from 'react';
import { nav } from '@/src/content';
import { ButtonLink, buttonClass } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Wordmark } from '@/components/ui/Wordmark';
import { MenuBars } from '@/components/ui/icons';
import { MenuOverlay } from './MenuOverlay';

/**
 * Fixed top navigation. Breakpoint behaviour measured on the reference:
 * ≥992 links pill + CONTACT + theme + menu · 480–991 theme + menu · <480 CONTACT + menu.
 * A3: once scrolled, the links pill and the menu button gain a translucent background.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="gutter pointer-events-none fixed inset-x-0 top-0 z-50 pt-[2.15rem] min-[480px]:pt-[3.125rem]">
        <div className="flex items-start justify-between">
          <a href="#main" aria-label="Greater — back to top" className="pointer-events-auto block rounded-sm">
            <Wordmark className="block text-[2.75rem] min-[480px]:text-[3.3rem]" />
          </a>
          <nav aria-label="Primary" className="pointer-events-auto mt-1 flex items-center gap-1">
            <div
              className={`hidden h-10 items-center gap-8 rounded-[0.25rem] px-4 transition-colors duration-300 min-[992px]:flex ${
                scrolled ? 'bg-[var(--nav-pill)] backdrop-blur-sm' : 'bg-transparent'
              }`}
            >
              {nav.links.map((l) => (
                <a key={l.label} href={l.href} className={buttonClass('ghost')}>
                  {l.label}
                </a>
              ))}
            </div>
            <ButtonLink href={nav.cta.href} className="max-[991px]:min-[480px]:hidden">
              {nav.cta.label}
            </ButtonLink>
            <ThemeToggle label={nav.themeToggleLabel} className="max-[479px]:hidden" />
            <button
              ref={menuButton}
              type="button"
              aria-label={nav.menuOpenLabel}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(true)}
              className={`grid size-10 place-items-center rounded-[0.25rem] text-ink transition-colors duration-200 hover:bg-muted ${
                scrolled ? 'bg-[var(--nav-pill)] backdrop-blur-sm' : ''
              }`}
            >
              <MenuBars />
            </button>
          </nav>
        </div>
      </header>
      <MenuOverlay
        open={open}
        onClose={() => {
          setOpen(false);
          menuButton.current?.focus();
        }}
      />
    </>
  );
}
