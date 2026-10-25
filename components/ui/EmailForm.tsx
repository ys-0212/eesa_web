'use client';

import { useId, useState } from 'react';
import { buttonClass } from './Button';

type Props = {
  placeholder: string;
  submit: string;
  label: string;
  variant?: 'primary' | 'soft';
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

/**
 * Email capture used by the hero, research and footer. There is deliberately no backend:
 * submit validates the address and shows a local confirmation (wire `onSubmit` to your provider).
 */
export function EmailForm({ placeholder, submit, label, variant = 'primary', className = '', inputClassName = '', buttonClassName = '' }: Props) {
  const id = useId();
  const [status, setStatus] = useState<'idle' | 'done' | 'invalid'>('idle');

  return (
    <form
      className={`flex gap-2 ${className}`}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const value = new FormData(e.currentTarget).get('email');
        setStatus(typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'done' : 'invalid');
      }}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name="email"
        type="email"
        autoComplete="email"
        placeholder={placeholder}
        aria-invalid={status === 'invalid' || undefined}
        aria-describedby={`${id}-status`}
        className={`t-mono h-10 min-w-0 rounded-[0.25rem] border border-ink/40 bg-transparent px-4 text-[0.875rem] text-ink placeholder:text-ink/80 focus-visible:border-accent ${inputClassName}`}
      />
      <button type="submit" className={buttonClass(variant, buttonClassName)}>
        {submit}
      </button>
      <p id={`${id}-status`} role="status" className="sr-only">
        {status === 'done' ? 'Thanks — we will be in touch.' : status === 'invalid' ? 'Please enter a valid email address.' : ''}
      </p>
    </form>
  );
}
