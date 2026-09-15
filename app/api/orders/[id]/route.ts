import { NextResponse } from 'next/server';
import { orders } from '@/lib/mock-data';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const order = orders.find((entry) => entry.id === params.id) ?? orders[0];
  return NextResponse.json(order);
}
