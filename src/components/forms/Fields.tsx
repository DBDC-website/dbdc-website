'use client';

import { forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';

const controlBase =
  'w-full rounded-md border bg-white px-3 py-2 text-sm text-brand-950 shadow-sm transition-colors placeholder:text-stone-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60';

function controlBorder(hasError?: boolean) {
  return hasError
    ? 'border-red-400 focus-visible:outline-red-500'
    : 'border-cream-300 hover:border-brand-300';
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-red-600" role="alert">
      {message}
    </p>
  );
}

type LabelProps = {
  htmlFor: string;
  label: string;
  required?: boolean;
};

function FieldLabel({ htmlFor, label, required }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-brand-900"
    >
      {label}
      {required ? (
        <span className="ml-0.5 text-red-500" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, hint, required, className, id, ...rest }, ref) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    return (
      <div className={className}>
        <FieldLabel htmlFor={fieldId} label={label} required={required} />
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(error && errorId, hint && hintId) || undefined}
          className={cn(controlBase, controlBorder(Boolean(error)))}
          {...rest}
        />
        {hint ? (
          <p id={hintId} className="mt-1.5 text-xs text-stone-500">
            {hint}
          </p>
        ) : null}
        <FieldError id={errorId} message={error} />
      </div>
    );
  },
);

type TextAreaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField(
    { label, error, hint, required, className, id, rows = 3, ...rest },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    return (
      <div className={className}>
        <FieldLabel htmlFor={fieldId} label={label} required={required} />
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(error && errorId, hint && hintId) || undefined}
          className={cn(controlBase, controlBorder(Boolean(error)), 'resize-y')}
          {...rest}
        />
        {hint ? (
          <p id={hintId} className="mt-1.5 text-xs text-stone-500">
            {hint}
          </p>
        ) : null}
        <FieldError id={errorId} message={error} />
      </div>
    );
  },
);

type CheckboxFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField({ label, className, id, ...rest }, ref) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <label
        htmlFor={fieldId}
        className={cn(
          'flex cursor-pointer items-start gap-2.5 text-sm text-brand-900',
          className,
        )}
      >
        <input
          ref={ref}
          id={fieldId}
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-cream-300 text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          {...rest}
        />
        <span className="leading-snug">{label}</span>
      </label>
    );
  },
);

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-cream-200/90 bg-white/90 p-6 shadow-sm shadow-brand-900/[0.04] sm:p-8">
      <div className="mb-5 border-b border-cream-200 pb-4">
        <h2 className="text-lg font-semibold text-brand-900 sm:text-xl">{title}</h2>
        {description ? (
          <p className="mt-1.5 text-sm text-stone-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
