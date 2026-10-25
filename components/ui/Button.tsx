import type { ComponentProps } from 'react';

type Variant = 'primary' | 'ghost' | 'soft';

/** `.gr-button` from the reference: 2.5rem tall mono uppercase, 0.25rem radius, 0.2s transitions. */
export const buttonClass = (variant: Variant = 'primary', extra = '') =>
  [
    't-mono inline-flex h-10 items-center justify-center gap-2 rounded-[0.25rem] whitespace-nowrap transition-[background-color,color,opacity] duration-200',
    variant === 'primary' && 'bg-accent px-6 text-[#f5f2f1] hover:opacity-90',
    variant === 'soft' && 'bg-accent-soft px-6 text-[#06110e] hover:bg-accent hover:text-[#f5f2f1]',
    variant === 'ghost' && 'text-ink hover:text-accent-ink',
    extra,
  ]
    .filter(Boolean)
    .join(' ');

export function ButtonLink({ variant = 'primary', className = '', ...props }: ComponentProps<'a'> & { variant?: Variant }) {
  return <a {...props} className={buttonClass(variant, className)} />;
}
