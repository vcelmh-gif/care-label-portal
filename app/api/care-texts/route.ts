import { NextResponse } from 'next/server';
import { careTexts } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(careTexts);
}
