import { prisma } from '@/lib/prisma';

type NotificationOrder = {
  id: string;
  poNumber: string;
  accountNumber: string;
  shapeName: string;
  expectedDeliveryDate: Date;
  madeInCountry: string;
  fibers: { name: string; percentage: number }[];
  sizes: { size: string; quantity: number }[];
  careSymbols: { code: string }[];
  careTexts: { text: string }[];
  customer: { email: string; name: string };
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character] as string));
}

export async function notifyOrder(order: NotificationOrder) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !fromEmail) {
    await prisma.order.update({
      where: { id: order.id },
      data: { notificationStatus: 'NOT_CONFIGURED', notificationError: 'Resend is not configured.' },
    });
    return { sent: false, configured: false };
  }

  const claim = await prisma.order.updateMany({
    where: { id: order.id, notificationStatus: 'NOT_SENT' },
    data: { notificationStatus: 'SENDING', notificationError: null },
  });
  if (claim.count === 0) return { sent: false, configured: true, duplicate: true };

  const totalQuantity = order.sizes.reduce((total, size) => total + size.quantity, 0);
  const detailRows = [
    ['Order', order.id],
    ['PO number', order.poNumber],
    ['Account number', order.accountNumber],
    ['Shape', order.shapeName],
    ['Expected delivery', order.expectedDeliveryDate.toISOString().slice(0, 10)],
    ['Made in', order.madeInCountry],
    ['Total quantity', `${totalQuantity} PC`],
  ].map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join('');
  const fibers = order.fibers.map((fiber) => `<li>${fiber.percentage}% ${escapeHtml(fiber.name)}</li>`).join('');
  const care = order.careTexts.map((text) => `<li>${escapeHtml(text.text)}</li>`).join('');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: fromEmail,
      to: [order.customer.email],
      subject: `Order confirmation: ${order.id}`,
      html: `<p>Hello ${escapeHtml(order.customer.name)},</p><p>Your care label order has been submitted successfully.</p><table>${detailRows}</table><h3>Fiber content</h3><ul>${fibers || '<li>None specified</li>'}</ul><h3>Care instructions</h3><ul>${care || '<li>None specified</li>'}</ul><p>Keep this email for your records. A PDF can be downloaded from the order detail page.</p>`,
    }),
  }).catch(() => null);

  if (!response?.ok) {
    await prisma.order.update({
      where: { id: order.id },
      data: { notificationStatus: 'FAILED', notificationError: 'Resend rejected the email.' },
    });
    return { sent: false, configured: true };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { notificationStatus: 'SENT', notificationSentAt: new Date(), notificationError: null },
  });
  return { sent: true, configured: true };
}
