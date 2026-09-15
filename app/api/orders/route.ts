import { NextResponse } from 'next/server';
import { orders } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json();
  const order = { id: `CL${Date.now()}`.slice(0, 11), ...body, status: 'DRAFT' };
  return NextResponse.json(order, { status: 201 });
}
