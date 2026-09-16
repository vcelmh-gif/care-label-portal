import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { fibers: true, sizes: true, careSymbols: true, careTexts: { orderBy: { position: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const customer = await prisma.user.findFirst({ where: { role: 'CUSTOMER' }, orderBy: { createdAt: 'asc' } });
  if (!customer) return NextResponse.json({ error: 'No customer account is available.' }, { status: 400 });
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid order payload.' }, { status: 400 });

  const order = await prisma.order.create({
    data: {
      id: `CL${Date.now()}`.slice(0, 11),
      customerId: customer.id,
      poNumber: typeof body.poNumber === 'string' ? body.poNumber : '',
      accountNumber: typeof body.accountNumber === 'string' ? body.accountNumber : '',
      shapeNo: typeof body.shapeNo === 'string' ? body.shapeNo : '',
      shapeName: typeof body.shapeName === 'string' ? body.shapeName : '',
      styleNo: typeof body.styleNo === 'string' ? body.styleNo : '',
      itemNo: typeof body.itemNo === 'string' ? body.itemNo : '',
      expectedDeliveryDate: body.expectedDeliveryDate ? new Date(body.expectedDeliveryDate) : new Date(),
      madeInCountry: typeof body.madeInCountry === 'string' ? body.madeInCountry : '',
    },
  });
  return NextResponse.json(order, { status: 201 });
}
