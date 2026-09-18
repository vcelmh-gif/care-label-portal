import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const orders = await prisma.order.findMany({
    where: user.role === 'ADMIN' ? undefined : { customerId: user.id },
    include: { customer: true, fibers: true, sizes: true, careSymbols: true, careTexts: { orderBy: { position: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const customer = user.role === 'CUSTOMER' ? user : null;
  if (!customer) return NextResponse.json({ error: 'No customer account is available.' }, { status: 400 });
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid order payload.' }, { status: 400 });

  const fibers = Array.isArray(body.fibers) ? body.fibers : [];
  const sizes = Array.isArray(body.sizes) ? body.sizes : [];
  const careSymbols = Array.isArray(body.careSymbols) ? body.careSymbols : [];
  const careTexts = Array.isArray(body.careTexts) ? body.careTexts : [];
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
      fibers: { create: fibers.map((fiber: { name?: string; percentage?: number }, position: number) => ({ name: fiber.name ?? '', percentage: Number(fiber.percentage) || 0, position })) },
      sizes: { create: sizes.map((size: { size?: string; quantity?: number }) => ({ size: size.size ?? '', quantity: Number(size.quantity) || 0 })) },
      careSymbols: { create: careSymbols.map((symbol: { group?: string; code?: string }) => ({ group: symbol.group ?? '', code: symbol.code ?? '' })) },
      careTexts: { create: careTexts.map((text: string, position: number) => ({ position, text })) },
    },
  });
  return NextResponse.json(order, { status: 201 });
}
