'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submitRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!name || !email || password.length < 8) {
      setError('Enter your name and email, and use a password with at least 8 characters.');
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.error ?? 'Unable to create the account.');
        return;
      }

      event.currentTarget.reset();
      setMessage('Account request created. An administrator must approve it before you can log in.');
    } catch {
      setError('Unable to reach the account service. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-10">
      <div className="w-full max-w-lg card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Create account</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Register</h1>

        <form className="mt-8 space-y-5" onSubmit={submitRegistration}>
          {message && <div className="rounded-lg border border-border bg-stone-50 p-4 text-sm">{message}</div>}
          {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Full name</label>
              <input className="input" name="name" type="text" placeholder="Alicia Wong" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Company</label>
              <input className="input" type="text" placeholder="Fashion Source" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input className="input" name="email" type="email" placeholder="name@example.com" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input className="input" name="password" type="password" placeholder="********" minLength={8} required />
          </div>
          <button type="submit" className="button-primary w-full">Request approval</button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Already have an account? <Link href="/login" className="font-medium text-ink">Login</Link>
        </p>
        <Link href="/" className="button-secondary mt-4 block w-full text-center">Back to home</Link>
      </div>
    </main>
  );
}
