import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/activity-logger'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    
    if (!userId || userRole !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    try {
      // Fetch the original order with items
      const originalOrder = await prisma.order.findUnique({
        where: { 
          id: orderId,
          userId // Ensure user owns this order
        },
        include: {
          items: {
            include: {
              service: true
            }
          },
          address: true,
          store: true
        }
      })

      if (!originalOrder) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // Calculate total amount
      let totalAmount = 0
      for (const item of originalOrder.items) {
        totalAmount += Number(item.price) * item.quantity
      }

      // Generate unique order number
      const orderNumber = `WL-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

      // Create new order with same items
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          storeId: originalOrder.storeId,
          addressId: originalOrder.addressId,
          totalAmount,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          specialInstructions: `Reorder of ${originalOrder.orderNumber}`,
          items: {
            create: originalOrder.items.map(item => ({
              serviceId: item.serviceId,
              quantity: item.quantity,
              price: item.price,
              notes: item.notes || ''
            }))
          }
        },
        include: {
          items: {
            include: {
              service: true
            }
          },
          store: true,
          address: true
        }
      })

      // Log the reorder activity
      await logActivity({
        type: 'ORDER_PLACED',
        description: `Reorder ${newOrder.orderNumber} placed for ₹${newOrder.totalAmount}`,
        userId: userId,
        metadata: {
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          totalAmount: newOrder.totalAmount,
          storeId: newOrder.storeId,
          storeName: newOrder.store.name,
          originalOrderNumber: originalOrder.orderNumber,
          isReorder: true
        }
      })

      return NextResponse.json({
        success: true,
        order: newOrder,
        message: 'Order created successfully. You can modify it before confirming.'
      })
    } catch (dbError) {
      console.error('Database error creating reorder:', dbError)
      return NextResponse.json(
        { error: 'Failed to create reorder' },
        { status: 500 }
      )
    }
  } catch (err: any) {
    console.error('reorder POST error', err)
    return NextResponse.json({ error: err?.message || 'failed' }, { status: 500 })
  }
}