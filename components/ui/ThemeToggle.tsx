'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from './icons';

const subscribe = (cb: () => void) => {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};
const getTheme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

/** A12 — light/dark toggle (reference: Lumos theme-toggle, 40×40 square on #eeeae7). */
export function ThemeToggle({ label, className = '' }: { label: string; className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'light');
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={dark}
      onClick={() => {
        const next = dark ? 'light' : 'dark';
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem('theme', next);
        } catch {}
      }}
      className={`grid size-10 place-items-center rounded-[0.25rem] bg-muted text-ink transition-colors duration-200 hover:bg-panel ${className}`}
    >
      {dark ? <Sun className="size-[1.1rem]" /> : <Moon className="size-4" />}
    </button>
  );
}
