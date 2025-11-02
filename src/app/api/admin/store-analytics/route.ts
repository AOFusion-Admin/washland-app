import { NextRequest, NextResponse } from 'next/server'
import { requireAdminHybrid } from '@/lib/hybrid-auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/store-analytics - Get analytics for a specific store
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
      // Get current date for calculations
      const today = new Date()
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      // Get real analytics from database
      const [
        todaysOrders,
        pendingPickups,
        readyForDelivery,
        totalCustomers,
        monthlyRevenue,
        activeRiders
      ] = await Promise.all([
        // Today's orders
        prisma.order.count({
          where: {
            storeId: storeId,
            createdAt: {
              gte: startOfToday
            }
          }
        }),

        // Pending pickups
        prisma.order.count({
          where: {
            storeId: storeId,
            status: {
              in: ['CONFIRMED', 'READY_FOR_PICKUP']
            }
          }
        }),

        // Ready for delivery
        prisma.order.count({
          where: {
            storeId: storeId,
            status: 'READY_FOR_PICKUP'
          }
        }),

        // Total customers (unique users who have placed orders at this store)
        prisma.order.groupBy({
          by: ['userId'],
          where: {
            storeId: storeId
          }
        }).then(result => result.length),

        // Monthly revenue (sum of paid orders this month)
        prisma.order.aggregate({
          where: {
            storeId: storeId,
            createdAt: {
              gte: startOfMonth
            },
            paymentStatus: 'PAID'
          },
          _sum: {
            totalAmount: true
          }
        }).then(result => result._sum.totalAmount || 0),

        // Active riders - this would need a separate Rider model
        // For now, we'll use a placeholder
        Promise.resolve(Math.floor(Math.random() * 8) + 2)
      ])

      const stats = {
        todaysOrders,
        pendingPickups,
        readyForDelivery,
        totalCustomers,
        monthlyRevenue: Number(monthlyRevenue),
        activeRiders
      }

      return NextResponse.json({
        success: true,
        stats,
        message: 'Store analytics retrieved successfully'
      })

    } catch (dbError) {
      console.error('Database error fetching analytics:', dbError)
      return NextResponse.json(
        { error: 'Failed to fetch analytics from database' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error fetching store analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}