'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';

const careSymbolImages: Record<string, string> = {
  W1: 'image18.png',
  W2: 'image19.png',
  B1: 'image13.png',
  D1: 'image17.png',
  I1: 'image15.png',
  DC1: 'image14.png',
};

type ApiOrder = {
  id: string;
  poNumber: string;
  accountNumber: string;
  shapeNo: string;
  shapeName: string;
  styleNo: string;
  itemNo: string;
  expectedDeliveryDate: string;
  madeInCountry: string;
  status: string;
  submittedAt?: string | null;
  notificationStatus?: string;
  fibers: { name: string; percentage: number }[];
  sizes: { quantity: number }[];
  careSymbols: { code: string }[];
  careTexts: { text: string }[];
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load order.');
        return response.json();
      })
      .then((data: ApiOrder) => {
        setOrder(data);
        setStatus(data.status);
      })
      .catch(() => setMessage('Unable to load this order from the database.'));
  }, [params.id]);

  if (!order) {
    return <main className="mx-auto max-w-5xl px-6 py-10"><p className="text-sm text-muted">{message || 'Loading order...'}</p></main>;
  }

  const careSymbols = order.careSymbols.map((symbol) => symbol.code);
  const totalQuantity = order.sizes.reduce((total, size) => total + size.quantity, 0);

  const downloadPdf = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('Care Label Order', 20, 20);
    pdf.setFontSize(11);
    pdf.text(`Order: ${order.id}`, 20, 34);
    pdf.text(`PO: ${order.poNumber}`, 20, 42);
    pdf.text('Care text', 20, 50);
    order.careTexts.forEach((careText, index) => pdf.text(careText.text, 28, 58 + index * 8));
    pdf.save(`${order.id}.pdf`);
  };

  const submitOrder = async () => {
    if (isSubmitting || status !== 'DRAFT') return;
    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await fetch(`/api/orders/${params.id}/submit`, { method: 'POST' });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || 'Unable to submit order.');
      setOrder((current) => current ? { ...current, ...data } : current);
      setStatus(data.status);
      const notificationMessage = data.notification?.sent
        ? ' A confirmation email was sent to the customer.'
        : data.notification?.configured === false
          ? ' Email notification is not configured; download the PDF below.'
          : ' The order was submitted, but the confirmation email could not be sent.';
      setMessage(`Order submitted.${notificationMessage}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to submit this order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Order</p>
          <h1 className="mt-2 text-3xl font-semibold">{order.id}</h1>
          <span className="badge mt-3">{status}</span>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <Link href="/orders" className="button-secondary">Back</Link>
          {status === 'DRAFT' && <Link href={`/orders/new?edit=${order.id}`} className="button-secondary">Edit draft</Link>}
          <button type="button" className="button-secondary" onClick={downloadPdf}>Download PDF</button>
          {status === 'DRAFT' && <button type="button" className="button-primary" onClick={submitOrder} disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit order'}</button>}
        </div>
      </div>
      {message && <div className="mt-6 rounded-lg border border-border bg-stone-50 p-4 text-sm">{message}</div>}

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
            <div><p className="text-sm text-muted">Total quantity</p><p className="mt-1 font-medium">{totalQuantity} PC</p></div>
          </div>
        </div>
        <div className="card p-8">
          <h2 className="text-lg font-semibold">Label preview</h2>
          <p className="mt-1 text-sm text-muted">English production preview</p>
          <div className="mt-6 rounded-xl border border-border bg-stone-50 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Made in {order.madeInCountry}</p>
            <p className="mt-4 text-lg font-semibold">{order.shapeName}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">{order.fibers.map((fiber) => <li key={fiber.name}>{fiber.percentage}% {fiber.name}</li>)}</ul>
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Care instructions</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {careSymbols.map((symbol) => <img key={symbol} src={`/symbols/${careSymbolImages[symbol]}`} alt={symbol} className="h-12 w-12 object-contain" />)}
              </div>
            </div>
            <div className="mt-6 border-t border-border pt-4 text-sm text-muted">{order.careTexts.map((careText) => <p key={careText.text}>{careText.text}</p>)}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
