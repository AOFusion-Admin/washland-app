import { NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'

/**
 * Public endpoint to get all stores for login page and locations page
 * No authentication required since this is needed for store selection and location display
 */
export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true }, // Only show active stores
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        phone: true,
        email: true,
        franchise: {
          select: {
            name: true
          }
        },
        storeServices: {
          where: { isActive: true },
          select: {
            service: {
              select: {
                name: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: [
        { franchise: { name: 'asc' } },
        { name: 'asc' }
      ]
    })

    // Transform the data to match the expected format for locations page
    const formattedStores = stores.map(store => ({
      id: store.id,
      name: store.name,
      address: store.address,
      city: store.city,
      state: store.state,
      pincode: store.zipCode,
      phone: store.phone,
      email: store.email || `${store.name.toLowerCase().replace(/\s+/g, '')}@washlandlaundry.in`,
      hours: {
        weekday: '7:00 AM - 8:00 PM',
        saturday: '8:00 AM - 6:00 PM',
        sunday: '9:00 AM - 5:00 PM'
      },
      services: store.storeServices.map(ss => ss.service.name)
    }))

    return NextResponse.json(formattedStores)
  } catch (err: any) {
    console.error('Public stores GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
  }
}