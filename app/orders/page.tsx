import Link from 'next/link';
import { orders } from '@/lib/mock-data';

export default function OrdersPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold">Order dashboard</h1>
        </div>
        <Link href="/orders/new" className="button-primary">Create order</Link>
      </div>

      <div className="mt-8 card overflow-hidden">
        <table className="min-w-full divide-y divide-border text-left">
          <thead className="bg-stone-50 text-sm text-muted">
            <tr>
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Delivery</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.customerName}</td>
                <td className="px-6 py-4">
                  <span className="badge">{order.status}</span>
                </td>
                <td className="px-6 py-4">{order.expectedDeliveryDate}</td>
                <td className="px-6 py-4">
                  <Link href={`/orders/${order.id}`} className="text-ink underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
