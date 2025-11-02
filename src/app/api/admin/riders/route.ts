import { NextRequest, NextResponse } from 'next/server'
import { requireAdminHybrid } from '@/lib/hybrid-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminHybrid(request, ['SUPER_ADMIN', 'STORE_ADMIN'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      )
    }

    try {
      // Verify store exists
      const store = await prisma.store.findUnique({ 
        where: { id: storeId },
        include: { franchise: true }
      })
      
      if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }

      // Get all active riders
      // For now, we'll return all riders. In a real system, you might want to filter by location, availability, etc.
      const riders = await prisma.user.findMany({
        where: {
          role: 'RIDER',
          isActive: true
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          createdAt: true
        },
        orderBy: {
          firstName: 'asc'
        }
      })

      return NextResponse.json({
        success: true,
        riders,
        store: {
          id: store.id,
          name: store.name,
          franchise: store.franchise.name
        }
      })
    } catch (dbError) {
      console.error('Database error fetching riders:', dbError)
      return NextResponse.json(
        { error: 'Failed to fetch riders from database' },
        { status: 500 }
      )
    }
  } catch (err: any) {
    console.error('riders GET error', err)
    return NextResponse.json({ error: err?.message || 'failed' }, { status: 500 })
  }
}