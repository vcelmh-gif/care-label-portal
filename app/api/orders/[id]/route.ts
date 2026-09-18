import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { customer: true, fibers: true, sizes: true, careSymbols: true, careTexts: { orderBy: { position: 'asc' } } },
  });
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  if (user.role !== 'ADMIN' && order.customerId !== user.id) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid order payload.' }, { status: 400 });
  const existing = await prisma.order.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  if (user.role !== 'ADMIN' && existing.customerId !== user.id) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  if (existing.status !== 'DRAFT') {
    return NextResponse.json({ error: 'Submitted orders cannot be edited.' }, { status: 409 });
  }
  const fibers = Array.isArray(body.fibers) ? body.fibers : [];
  const sizes = Array.isArray(body.sizes) ? body.sizes : [];
  const careSymbols = Array.isArray(body.careSymbols) ? body.careSymbols : [];
  const careTexts = Array.isArray(body.careTexts) ? body.careTexts : [];
  const order = await prisma.$transaction(async (tx) => {
    await tx.fiberContent.deleteMany({ where: { orderId: params.id } });
    await tx.sizeQuantity.deleteMany({ where: { orderId: params.id } });
    await tx.careSelection.deleteMany({ where: { orderId: params.id } });
    await tx.careTextSelection.deleteMany({ where: { orderId: params.id } });
    return tx.order.update({
      where: { id: params.id },
      data: {
        poNumber: body.poNumber ?? '', accountNumber: body.accountNumber ?? '',
        shapeNo: body.shapeNo ?? '', shapeName: body.shapeName ?? '',
        styleNo: body.styleNo ?? '', itemNo: body.itemNo ?? '',
        expectedDeliveryDate: new Date(body.expectedDeliveryDate), madeInCountry: body.madeInCountry ?? '',
        fibers: { create: fibers.map((fiber: { name?: string; percentage?: number }, position: number) => ({ name: fiber.name ?? '', percentage: Number(fiber.percentage) || 0, position })) },
        sizes: { create: sizes.map((size: { size?: string; quantity?: number }) => ({ size: size.size ?? '', quantity: Number(size.quantity) || 0 })) },
        careSymbols: { create: careSymbols.map((symbol: { group?: string; code?: string }) => ({ group: symbol.group ?? '', code: symbol.code ?? '' })) },
        careTexts: { create: careTexts.map((text: string, position: number) => ({ position, text })) },
      },
    });
  });
  return NextResponse.json(order);
}
