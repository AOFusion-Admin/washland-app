import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    
    if (!userId || userRole !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '5')

    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              service: true
            }
          },
          store: {
            select: {
              name: true,
              city: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })

      const formattedOrders = orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt,
        itemsCount: order.items.length,
        store: order.store
      }))

      return NextResponse.json({
        success: true,
        orders: formattedOrders
      })
    } catch (dbError) {
      console.error('Database error fetching recent orders:', dbError)
      return NextResponse.json(
        { error: 'Failed to fetch recent orders' },
        { status: 500 }
      )
    }
  } catch (err: any) {
    console.error('recent orders GET error', err)
    return NextResponse.json({ error: err?.message || 'failed' }, { status: 500 })
  }
}