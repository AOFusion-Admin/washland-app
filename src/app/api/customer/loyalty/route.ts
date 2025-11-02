import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Implement when Prisma client is regenerated with loyalty models
    // For now, return mock data structure
    const mockLoyaltyData = {
      totalPoints: 1250,
      availablePoints: 850,
      usedPoints: 400,
      pointsHistory: [
        {
          id: '1',
          type: 'EARNED',
          points: 150,
          description: 'Order completion - ORD-001',
          orderId: 'ORD-001',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'REDEEMED',
          points: 200,
          description: 'Free wash coupon redeemed',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      redeemableRewards: [
        {
          id: 'reward1',
          name: 'Free Basic Wash',
          description: 'Get one basic wash service absolutely free',
          pointsRequired: 500,
          category: 'Service',
          isActive: true
        },
        {
          id: 'reward2',
          name: '20% Discount Coupon',
          description: 'Get 20% off on your next order',
          pointsRequired: 300,
          category: 'Discount',
          isActive: true
        },
        {
          id: 'reward3',
          name: 'Premium Wash Package',
          description: 'Upgrade to premium wash with starch and fold',
          pointsRequired: 1000,
          category: 'Service',
          isActive: true
        }
      ]
    }

    return NextResponse.json({
      success: true,
      loyalty: mockLoyaltyData,
      message: 'Loyalty data retrieved successfully (mock data - requires Prisma client regeneration)'
    })

  } catch (error) {
    console.error('Error fetching loyalty data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}