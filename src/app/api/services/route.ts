import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Service {
  id: string
  name: string
  description: string | null
  basePrice: number
  category: string
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        basePrice: true,
        category: true
      },
      orderBy: { name: 'asc' }
    })

    // Transform to match the expected format for the book-service page
    const formattedServices = services.map((service) => ({
      id: service.id,
      name: service.name,
      price: `From ₹${Number(service.basePrice)}`,
      description: service.description || `${service.category} service`,
      category: service.category
    }))

    return NextResponse.json(formattedServices)
  } catch (err: any) {
    console.error('Services GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}