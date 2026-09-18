'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type AuthSession = { email: string; name: string; role: string };
type ApiOrder = {
  id: string;
  customer: { name: string; email: string };
  status: string;
  expectedDeliveryDate: string;
  sizes: { quantity: number }[];
};

export default function OrdersPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/session').then((response) => response.ok ? response.json() : null)
      .then((data) => setSession(data?.user ?? null)).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!session) return;
    fetch('/api/orders')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load orders.');
        return response.json();
      })
      .then((data: ApiOrder[]) => setOrders(data))
      .catch(() => setError('Unable to load orders from the database.'));
  }, [session]);

  async function deleteDraft(order: ApiOrder) {
    if (!window.confirm(`Delete draft ${order.id}? This action cannot be undone.`)) return;
    setError('');
    const response = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error ?? 'Unable to delete draft.');
      return;
    }
    setOrders((current) => current.filter((item) => item.id !== order.id));
  }

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold">My orders</h1>
        </div>
        <div className="flex items-center gap-3">
          {session.role === 'ADMIN' && (
            <Link href="/admin/users" className="button-secondary">Admin</Link>
          )}
          <button className="button-secondary" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); setSession(null); }}>Log out</button>
          <Link href="/orders/new" className="button-primary">Create order</Link>
        </div>
      </div>
      {error && <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="mt-8 card overflow-hidden">
        <table className="min-w-full divide-y divide-border text-left">
          <thead className="bg-stone-50 text-sm text-muted"><tr><th className="px-6 py-3">Order</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Total quantity</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Delivery</th><th className="px-6 py-3">Action</th></tr></thead>
          <tbody className="divide-y divide-border text-sm">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.customer.name}</td>
                <td className="px-6 py-4">{order.sizes.reduce((total, size) => total + size.quantity, 0)} PC</td>
                <td className="px-6 py-4"><span className="badge">{order.status}</span></td>
                <td className="px-6 py-4">{order.expectedDeliveryDate}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/orders/${order.id}`} className="text-ink underline">View</Link>
                    {order.status === 'DRAFT' && (
                      <>
                        <Link href={`/orders/new?edit=${order.id}`} className="text-ink underline">Edit</Link>
                        <button type="button" onClick={() => deleteDraft(order)} className="text-red-700 underline">Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-sm text-muted">No orders are associated with this account yet.</p>}
      </div>
    </main>
  );
}
