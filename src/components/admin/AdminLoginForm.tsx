'use client';

import { useState, useTransition } from 'react';
import { sendAdminMagicLink } from '@/app/admin/actions/auth';
import Button from '@/components/ui/Button';

type AdminLoginFormProps = {
  initialError?: string | null;
};

export default function AdminLoginForm({ initialError }: AdminLoginFormProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await sendAdminMagicLink(email);
      if (result.ok) {
        setMessage(result.message);
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="admin-email"
          className="mb-1.5 block text-sm font-medium text-brand-900"
        >
          Work email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-cream-300 bg-white px-3 py-2 text-sm text-brand-950 shadow-sm placeholder:text-stone-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          placeholder="you@example.com"
        />
      </div>

      {error ? (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {message ? (
        <p
          className="rounded-md border border-sage-200 bg-sage-50 px-3 py-2 text-sm text-sage-800"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? 'Sending…' : 'Send magic link'}
      </Button>
    </form>
  );
}
