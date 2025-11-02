import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    
    if (!userId || userRole !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      // Get dashboard statistics
      const [
        activeOrdersCount,
        totalOrdersCount
      ] = await Promise.all([
        // Active orders (not completed or cancelled)
        prisma.order.count({
          where: {
            userId,
            status: {
              notIn: ['COMPLETED', 'CANCELLED']
            }
          }
        }),
        
        // Total orders
        prisma.order.count({
          where: { userId }
        })
      ])

      const stats = {
        activeOrders: activeOrdersCount,
        totalOrders: totalOrdersCount,
        loyaltyPoints: 0, // Will implement once Prisma client is fully regenerated
        walletBalance: 0   // Will implement once Prisma client is fully regenerated
      }

      return NextResponse.json({
        success: true,
        stats
      })
    } catch (dbError) {
      console.error('Database error fetching dashboard stats:', dbError)
      return NextResponse.json(
        { error: 'Failed to fetch dashboard statistics' },
        { status: 500 }
      )
    }
  } catch (err: any) {
    console.error('dashboard stats GET error', err)
    return NextResponse.json({ error: err?.message || 'failed' }, { status: 500 })
  }
}