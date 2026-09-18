'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const email = String(new FormData(event.currentTarget).get('email') ?? '').trim();
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.error ?? 'Unable to send a reset link.');
        return;
      }
      setSent(true);
    } catch {
      setError('Unable to reach the account service. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-10">
      <div className="w-full max-w-md card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Account recovery</p>
        <h1 className="mt-3 text-3xl font-semibold">Forgot password</h1>
        <p className="mt-3 text-sm text-muted">Enter your registered email and we will send a reset link.</p>
        {sent ? (
          <div className="mt-8 rounded-lg border border-border bg-stone-50 p-4 text-sm">If an account exists for that email, a reset link has been sent.</div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={submit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Email</span>
              <input className="input" name="email" type="email" required placeholder="name@example.com" />
            </label>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <button type="submit" className="button-primary w-full">Send reset link</button>
          </form>
        )}
        <Link href="/login" className="mt-6 block text-sm text-muted hover:text-ink hover:underline">Back to login</Link>
      </div>
    </main>
  );
}
