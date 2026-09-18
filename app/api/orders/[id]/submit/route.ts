import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const existing = await prisma.order.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  if (user.role !== 'ADMIN' && existing.customerId !== user.id) {
    return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  }
  if (existing.status !== 'DRAFT') {
    return NextResponse.json({ error: 'Only draft orders can be submitted.' }, { status: 409 });
  }

  const submittedAt = new Date();
  const result = await prisma.order.updateMany({
    where: { id: params.id, status: 'DRAFT' },
    data: { status: 'SUBMITTED', submittedAt },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: 'Only draft orders can be submitted.' }, { status: 409 });
  }

  const order = await prisma.order.findUnique({ where: { id: params.id } });
  return NextResponse.json(order);
}
