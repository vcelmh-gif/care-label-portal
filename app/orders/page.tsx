'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { orders } from '@/lib/mock-data';

type AuthSession = { email: string };

export default function OrdersPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('care-label-auth');
    if (stored) {
      try {
        setSession(JSON.parse(stored) as AuthSession);
      } catch {
        window.localStorage.removeItem('care-label-auth');
      }
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Login required</h1>
          <p className="mt-3 text-muted">Sign in to browse your care label orders.</p>
          <Link href="/login" className="button-primary mt-6">Go to login</Link>
        </div>
      </main>
    );
  }

  const visibleOrders = session.email === 'maya@carelabel.co'
    ? orders
    : orders.filter((order) => order.customerName === 'Alicia Wong');

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold">My orders</h1>
        </div>
        <Link href="/orders/new" className="button-primary">Create order</Link>
      </div>
      <div className="mt-8 card overflow-hidden">
        <table className="min-w-full divide-y divide-border text-left">
          <thead className="bg-stone-50 text-sm text-muted"><tr><th className="px-6 py-3">Order</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Delivery</th><th className="px-6 py-3">Action</th></tr></thead>
          <tbody className="divide-y divide-border text-sm">
            {visibleOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4"><span className="badge">{order.status}</span></td>
                <td className="px-6 py-4">{order.expectedDeliveryDate}</td>
                <td className="px-6 py-4"><Link href={`/orders/${order.id}`} className="text-ink underline">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleOrders.length === 0 && <p className="p-6 text-sm text-muted">No orders are associated with this account yet.</p>}
      </div>
    </main>
  );
}
