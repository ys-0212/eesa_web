type IconProps = { className?: string };

const base = { 'aria-hidden': true, focusable: false } as const;

export const ChevronRight = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3.5 10.5 8 6 12.5" />
  </svg>
);

export const ChevronLeft = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 3.5 5.5 8 10 12.5" />
  </svg>
);

export const Plus = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 3v14M3 10h14" />
  </svg>
);

export const Moon = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
    <path d="M12.6 3.2a7 7 0 1 0 4.2 9.6 5.6 5.6 0 0 1-4.2-9.6Z" />
  </svg>
);

export const Sun = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="10" cy="10" r="3.6" fill="currentColor" />
    <path d="M10 1.5v2.2M10 16.3v2.2M1.5 10h2.2M16.3 10h2.2M4 4l1.5 1.5M14.5 14.5 16 16M4 16l1.5-1.5M14.5 5.5 16 4" strokeLinecap="round" />
  </svg>
);

/** Reference's menu glyph: three right-aligned bars of decreasing length. */
export const MenuBars = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
    <rect x="2" y="3" width="12" height="2" />
    <rect x="2" y="7" width="9" height="2" />
    <rect x="2" y="11" width="12" height="2" />
  </svg>
);

export const Close = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" />
  </svg>
);

export const Search = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="8.5" cy="8.5" r="5.5" />
    <path d="m13 13 4.5 4.5" />
  </svg>
);

export const Heart = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M10 16.5S3 12.4 3 7.6A3.6 3.6 0 0 1 10 6a3.6 3.6 0 0 1 7 1.6c0 4.8-7 8.9-7 8.9Z" />
  </svg>
);

export const Globe = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="10" cy="10" r="7.5" />
    <path d="M2.5 10h15M10 2.5c2.2 2.3 3 4.8 3 7.5s-.8 5.2-3 7.5c-2.2-2.3-3-4.8-3-7.5s.8-5.2 3-7.5Z" />
  </svg>
);

/** Figma-style arrow used by the collaborator and "YOU" cursors. */
export const CursorArrow = ({ className }: IconProps) => (
  <svg {...base} className={className} viewBox="0 0 22 22" width="22" height="22" fill="currentColor">
    <path d="M1.5 1.5 20 8.2l-8 2.4-3.1 8.1L1.5 1.5Z" />
  </svg>
);
