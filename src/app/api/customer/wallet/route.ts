import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // TODO: Implement when Prisma client is regenerated with wallet models
    // For now, return mock data structure
    const mockWalletData = {
      balance: 850.00,
      pendingRefunds: 150.00,
      totalSpent: 2500.00,
      transactions: [
        {
          id: '1',
          type: 'CREDIT',
          amount: 500,
          description: 'Money added via UPI',
          status: 'COMPLETED',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'DEBIT',
          amount: 250,
          description: 'Order payment - ORD-001',
          orderId: 'ORD-001',
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'REFUND',
          amount: 150,
          description: 'Order cancellation refund - ORD-002',
          orderId: 'ORD-002',
          status: 'PENDING',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          type: 'CREDIT',
          amount: 300,
          description: 'Cashback from referral',
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }

    return NextResponse.json({
      success: true,
      wallet: mockWalletData,
      message: 'Wallet data retrieved successfully (mock data - requires Prisma client regeneration)'
    })

  } catch (error) {
    console.error('Error fetching wallet data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}