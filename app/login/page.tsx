'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('alicia@fashionsource.io');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password to continue.');
      return;
    }
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.error ?? 'Unable to sign in.');
        return;
      }
      window.localStorage.setItem('care-label-auth', JSON.stringify(result.user));
      router.push('/orders');
    } catch {
      setError('Unable to reach the account service. Please try again.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-10">
      <div className="w-full max-w-md card p-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted">CASESTUDY</p>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">Care Label Portal</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Login</h1>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="email">Email</label>
            <input id="email" className="input" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="password">Password</label>
            <input id="password" className="input" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <button type="submit" className="button-primary w-full">Sign in</button>
        </form>

        <div className="mt-6 text-sm text-muted">
          Need an account? <Link href="/register" className="font-medium text-ink hover:underline">Create account</Link>
        </div>
        <Link href="/forgot-password" className="mt-3 block text-sm text-muted hover:text-ink hover:underline">Forgot password?</Link>
      </div>
    </main>
  );
}
