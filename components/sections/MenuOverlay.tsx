'use client';

import { useEffect, useRef } from 'react';
import { footer, menu, nav } from '@/src/content';
import { useLenis } from '@/lib/animations/MotionProvider';
import { Wordmark } from '@/components/ui/Wordmark';
import { ChevronRight, Close, Globe, Search } from '@/components/ui/icons';

/**
 * A11 — full-screen menu. Right panel (search + large mono links) slides in from the right;
 * on ≥992px a rounded sitemap card slides in from the left. Focus is trapped while open,
 * Escape closes, and page scrolling is paused.
 */
export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const lenis = useLenis();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Retry on animation frames until focus actually lands (the element must be rendered visible first).
    let raf = 0;
    let tries = 0;
    const focusClose = () => {
      closeRef.current?.focus();
      if (document.activeElement !== closeRef.current && tries++ < 60) raf = requestAnimationFrame(focusClose);
    };
    raf = requestAnimationFrame(focusClose);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      if (e.key !== 'Tab' || !ref.current) return;
      const focusable = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href], button, input')).filter((el) => el.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [open, lenis]);

  const link = 'inline-flex items-center gap-2 transition-colors duration-200 hover:text-accent-ink';

  return (
    <div
      ref={ref}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      // Visibility only transitions on close; on open it must flip at once so focus can move inside.
      className={`fixed inset-0 z-[80] flex overflow-hidden bg-panel duration-500 ${
        open ? 'visible opacity-100 transition-opacity' : 'invisible opacity-0 transition-[opacity,visibility]'
      }`}
    >
      {/* Sitemap card (desktop) */}
      <div
        className={`my-4 hidden flex-1 rounded-r-2xl bg-page transition-transform duration-700 ease-out-expo min-[992px]:flex ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="m-auto grid w-full max-w-[38.5rem] translate-x-[2.4rem] -translate-y-[2.6rem] grid-cols-3 gap-x-3 gap-y-12">
          {footer.columns.map((col) => (
            <div key={col.heading}>
              <p className="t-mono mb-5 text-[0.875rem] text-accent">{col.heading}</p>
              <ul className="space-y-[0.9rem]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} onClick={onClose} className={`t-mono text-[0.875rem] ${link}`}>
                      {l.label}
                      <ChevronRight className="size-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="t-mono col-start-3 flex items-center gap-2 self-end text-[0.875rem]">
            {footer.reach} <Globe className="size-4" />
          </p>
        </div>
      </div>

      {/* Primary panel */}
      <div
        className={`flex w-full flex-col px-4 pt-8 pb-8 transition-transform duration-700 ease-out-expo min-[480px]:px-16 min-[480px]:pt-12 min-[992px]:w-[34.5%] min-[992px]:pr-[var(--gutter)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <Wordmark className="text-[2.45rem]" />
          <button ref={closeRef} type="button" aria-label={nav.menuCloseLabel} onClick={onClose} className="grid size-10 place-items-center rounded-[0.25rem] hover:bg-muted">
            <Close />
          </button>
        </div>
        <form role="search" className="mt-auto mb-12 min-[480px]:mt-[9.5rem] min-[480px]:mb-0" onSubmit={(e) => e.preventDefault()}>
          <label className="flex h-10 items-center gap-3 rounded-[0.25rem] border border-ink/30 px-4 focus-within:border-accent">
            <Search className="shrink-0" />
            <span className="sr-only">Search the site</span>
            <input type="search" placeholder={menu.searchPlaceholder} className="t-mono w-full bg-transparent text-[0.875rem] outline-none placeholder:text-ink" />
          </label>
        </form>
        <ul className="mt-6 space-y-[1.4rem] min-[480px]:mt-[4.6rem]">
          {menu.primary.map((l) => (
            <li key={l.label}>
              <a href={l.href} onClick={onClose} className={`t-mono text-[1.6rem] min-[480px]:text-[2rem] ${link}`}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <hr className="mt-10 border-ink/40" />
        <ul className="mt-8 space-y-5 pb-4">
          {menu.secondary.map((l) => (
            <li key={l.label}>
              <a href={l.href} onClick={onClose} className={`t-mono ${link}`}>
                {l.label} <ChevronRight className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
