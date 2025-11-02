import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Implement when Prisma client is regenerated with referral models
    // For now, return mock data structure
    const mockReferralData = {
      referralCode: 'WASH' + userId.slice(-4).toUpperCase(),
      totalReferrals: 5,
      successfulReferrals: 3,
      pendingReferrals: 2,
      totalEarnings: 1500,
      referralHistory: [
        {
          id: '1',
          refereeEmail: 'friend1@example.com',
          refereeName: 'John Doe',
          status: 'COMPLETED',
          bonusEarned: 500,
          dateReferred: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          dateCompleted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          refereeEmail: 'friend2@example.com',
          refereeName: 'Jane Smith',
          status: 'PENDING',
          bonusEarned: 0,
          dateReferred: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      bonusStructure: [
        {
          condition: 'Friend signs up with your code',
          bonus: 100,
          type: 'POINTS'
        },
        {
          condition: 'Friend places first order',
          bonus: 500,
          type: 'POINTS'
        },
        {
          condition: 'Friend completes 3 orders',
          bonus: 300,
          type: 'CASH'
        },
        {
          condition: 'You refer 5 friends in a month',
          bonus: 25,
          type: 'DISCOUNT'
        }
      ]
    }

    return NextResponse.json({
      success: true,
      referral: mockReferralData,
      message: 'Referral data retrieved successfully (mock data - requires Prisma client regeneration)'
    })

  } catch (error) {
    console.error('Error fetching referral data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}