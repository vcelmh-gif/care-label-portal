'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  return children;
}
