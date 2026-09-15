import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-10">
      <div className="w-full max-w-lg card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Create account</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Register</h1>

        <form className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Full name</label>
              <input className="input" type="text" placeholder="Alicia Wong" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Company</label>
              <input className="input" type="text" placeholder="Fashion Source" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input className="input" type="email" placeholder="name@example.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input className="input" type="password" placeholder="********" />
          </div>
          <button type="submit" className="button-primary w-full">Request approval</button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Already have an account? <Link href="/login" className="font-medium text-ink">Login</Link>
        </p>
      </div>
    </main>
  );
}
