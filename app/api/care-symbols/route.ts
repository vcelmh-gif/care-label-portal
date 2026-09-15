import { NextResponse } from 'next/server';
import { careSymbols } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(careSymbols);
}
