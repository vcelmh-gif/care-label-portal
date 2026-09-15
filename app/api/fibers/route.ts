import { NextResponse } from 'next/server';
import { fibers } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(fibers);
}
