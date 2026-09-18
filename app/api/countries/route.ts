import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const records = await prisma.country.findMany({ where: { isActive: true }, orderBy: { name: 'asc' }, select: { name: true } });
  return NextResponse.json(records.map((record) => record.name));
}
