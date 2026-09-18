import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const records = await prisma.careText.findMany({ where: { isActive: true }, orderBy: { text: 'asc' }, select: { text: true } });
  return NextResponse.json(records.map((record) => record.text));
}
