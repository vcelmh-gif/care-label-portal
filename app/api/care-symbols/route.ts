import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const records = await prisma.careSymbol.findMany({ where: { isActive: true }, orderBy: { code: 'asc' }, select: { code: true } });
  return NextResponse.json(records.map((record) => record.code));
}
