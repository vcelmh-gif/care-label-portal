import Link from 'next/link';
import { orders } from '@/lib/mock-data';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = orders.find((entry) => entry.id === params.id) ?? orders[0];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Order</p>
          <h1 className="mt-2 text-3xl font-semibold">{order.id}</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/orders" className="button-secondary">Back</Link>
          <button className="button-primary">Generate PDF</button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div><p className="text-sm text-muted">PO Number</p><p className="mt-1 font-medium">{order.poNumber}</p></div>
            <div><p className="text-sm text-muted">Account Number</p><p className="mt-1 font-medium">{order.accountNumber}</p></div>
            <div><p className="text-sm text-muted">Shape No</p><p className="mt-1 font-medium">{order.shapeNo}</p></div>
            <div><p className="text-sm text-muted">Shape Name</p><p className="mt-1 font-medium">{order.shapeName}</p></div>
            <div><p className="text-sm text-muted">Style No</p><p className="mt-1 font-medium">{order.styleNo}</p></div>
            <div><p className="text-sm text-muted">Item No</p><p className="mt-1 font-medium">{order.itemNo}</p></div>
            <div><p className="text-sm text-muted">Delivery</p><p className="mt-1 font-medium">{order.expectedDeliveryDate}</p></div>
            <div><p className="text-sm text-muted">Country of Origin</p><p className="mt-1 font-medium">{order.madeInCountry}</p></div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Fiber content</h2>
            <ul className="mt-3 space-y-2 text-muted">
              {order.fibers.map((fiber) => (
                <li key={fiber.name}>{fiber.name}: {fiber.percentage}%</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card p-8">
          <h2 className="text-lg font-semibold">Label preview</h2>
          <div className="mt-6 rounded-xl border border-border bg-stone-50 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Made in {order.madeInCountry}</p>
            <p className="mt-4 text-lg font-semibold">{order.shapeName}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {order.fibers.map((fiber) => (
                <li key={fiber.name}>{fiber.percentage}% {fiber.name}</li>
              ))}
            </ul>
            <div className="mt-6 border-t border-border pt-4 text-sm text-muted">
              {order.careText.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
