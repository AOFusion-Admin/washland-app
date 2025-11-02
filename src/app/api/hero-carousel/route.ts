import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const FALLBACK = ['/hero-laundry-1.svg', '/hero-delivery-1.svg', '/offer-first-order.svg']

export async function GET() {
  try {
    // try to get active heroContent images first
    if (prisma && prisma.heroContent) {
      const content = await prisma.heroContent.findFirst({
        where: { isActive: true },
        include: { images: { where: { isActive: true }, orderBy: { displayOrder: 'asc' } } }
      })

      if (content && Array.isArray(content.images) && content.images.length > 0) {
        const imgs = content.images
          .map((i: any) => i.imageUrl || i.url || i.path)
          .filter(Boolean)
          .slice(0, 3)

        // pad to 3
        while (imgs.length < 3) imgs.push(FALLBACK[imgs.length] || FALLBACK[0])

        return NextResponse.json({ images: imgs })
      }
    }

    // fallback
    return NextResponse.json({ images: FALLBACK })
  } catch (err) {
    console.error('Error in /api/hero-carousel', err)
    return NextResponse.json({ images: FALLBACK })
  }
}