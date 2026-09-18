'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const adminLinks = [
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/countries', label: 'Countries' },
  { href: '/admin/fibers', label: 'Fibers' },
  { href: '/admin/care-texts', label: 'Care Texts' },
  { href: '/admin/care-symbols', label: 'Care Symbols' },
  { href: '/admin/roles', label: 'Roles' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (data?.user?.role === 'ADMIN') setAllowed(true);
        else router.replace('/login');
      })
      .catch(() => router.replace('/login'));
  }, [router]);

  if (!allowed) return null;
  return (
    <div>
      <nav className="border-b border-border bg-stone-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-4">
          <Link href="/orders" className="mr-3 text-sm font-semibold text-ink">Care Label Portal</Link>
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-muted hover:bg-white hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      {children}
    </div>
  );
}
