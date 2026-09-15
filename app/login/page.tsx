import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-10">
      <div className="w-full max-w-md card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Care Label Portal</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Login</h1>

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input className="input" type="email" defaultValue="maya@carelabel.co" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input className="input" type="password" defaultValue="password123" />
          </div>
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
