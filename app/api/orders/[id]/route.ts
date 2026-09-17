import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { customer: true, fibers: true, sizes: true, careSymbols: true, careTexts: { orderBy: { position: 'asc' } } },
  });
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  return NextResponse.json(order);
}
