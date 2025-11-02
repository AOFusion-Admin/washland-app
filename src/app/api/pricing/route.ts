import { NextResponse } from 'next/server'
import { defaultPricing } from '@/lib/defaults'

export async function GET() {
  // In future we can fetch real pricing from DB; for now return shared defaults
  return NextResponse.json({ data: defaultPricing })
}
