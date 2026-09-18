'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');
    const password = String(new FormData(event.currentTarget).get('password') ?? '');
    const confirmation = String(new FormData(event.currentTarget).get('confirmation') ?? '');
    if (password.length < 8 || password !== confirmation) {
      setError(password !== confirmation ? 'Passwords do not match.' : 'Use a password with at least 8 characters.');
      return;
    }
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.error ?? 'Unable to reset your password.');
        return;
      }
      setMessage(result.message);
      event.currentTarget.reset();
    } catch {
      setError('Unable to reach the account service. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-10">
      <div className="w-full max-w-md card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Account recovery</p>
        <h1 className="mt-3 text-3xl font-semibold">Reset password</h1>
        <p className="mt-3 text-sm text-muted">Choose a new password for your account.</p>
        {message ? <div className="mt-8 rounded-lg border border-border bg-stone-50 p-4 text-sm">{message} <Link className="font-medium underline" href="/login">Sign in</Link>.</div> : (
          <form className="mt-8 space-y-5" onSubmit={submit}>
            <label className="block"><span className="mb-2 block text-sm font-medium">New password</span><input className="input" name="password" type="password" minLength={8} required /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium">Confirm password</span><input className="input" name="confirmation" type="password" minLength={8} required /></label>
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <button type="submit" className="button-primary w-full">Reset password</button>
          </form>
        )}
        <Link href="/login" className="mt-6 block text-sm text-muted hover:text-ink hover:underline">Back to login</Link>
      </div>
    </main>
  );
}
