import { NextRequest, NextResponse } from 'next/server'
import { requireAdminHybrid } from '@/lib/hybrid-auth'
import { prisma } from '@/lib/prisma'
import { OrderStatus, PaymentStatus } from '@prisma/client'
import { logActivity } from '@/lib/activity-logger'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminHybrid(request, ['SUPER_ADMIN', 'STORE_ADMIN'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const storeId = searchParams.get('storeId')
    const franchiseId = searchParams.get('franchiseId')
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const whereClause: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      storeId?: string;
      store?: { franchiseId: string };
      userId?: string;
    } = {}

    if (status && status !== 'all') {
      whereClause.status = status as OrderStatus
    }
    
    if (paymentStatus && paymentStatus !== 'all') {
      whereClause.paymentStatus = paymentStatus as PaymentStatus
    }
    
    if (storeId) {
      whereClause.storeId = storeId
    }
    
    if (franchiseId) {
      whereClause.store = {
        franchiseId: franchiseId
      }
    }
    
    if (userId) {
      whereClause.userId = userId
    }

    const skip = (page - 1) * limit

    try {
      const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
          where: whereClause,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            },
            store: {
              include: {
                franchise: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            address: true,
            items: {
              include: {
                service: true
              }
            },
            pickupRider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            },
            deliveryRider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.order.count({ where: whereClause })
      ])
      
      return NextResponse.json({
        success: true,
        orders,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        }
      })
    } catch (dbError) {
      console.error('Database error fetching orders:', dbError)
      return NextResponse.json(
        { error: 'Failed to fetch orders from database' },
        { status: 500 }
      )
    }
  } catch (err) {
    console.error('orders GET error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminHybrid(request, ['SUPER_ADMIN', 'STORE_ADMIN'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { 
      userId, 
      storeId, 
      addressId, 
      items, // Array of {serviceId, quantity, price, notes?}
      pickupDate,
      deliveryDate,
      specialInstructions,
      customerName,
      customerPhone
    } = body

    if (!storeId || !items || items.length === 0) {
      return NextResponse.json({ 
        error: 'Store ID and at least one item are required' 
      }, { status: 400 })
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json({ 
        error: 'Customer name and phone are required' 
      }, { status: 400 })
    }

    try {
      // Validate store exists
      const store = await prisma.store.findUnique({ where: { id: storeId } })
      if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }

      // If userId provided, validate user exists
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
      }

      // If addressId provided, validate address exists
      if (addressId) {
        const address = await prisma.address.findUnique({ where: { id: addressId } })
        if (!address) {
          return NextResponse.json({ error: 'Address not found' }, { status: 404 })
        }
      }

      // Calculate total amount
      let totalAmount = 0
      for (const item of items) {
        const price = parseFloat(item.price)
        if (isNaN(price) || price < 0) {
          return NextResponse.json({ 
            error: `Invalid price for item: ${item.serviceId || item.itemType}` 
          }, { status: 400 })
        }
        totalAmount += price * item.quantity
      }

      // Generate unique order number
      const orderNumber = `WL-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          storeId,
          addressId: addressId || null,
          totalAmount,
          pickupDate: pickupDate ? new Date(pickupDate) : null,
          deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
          specialInstructions: specialInstructions || '',
          items: {
            create: items.map((item: any) => ({
              serviceId: item.serviceId || null,
              quantity: item.quantity,
              price: parseFloat(item.price),
              notes: item.notes || item.instructions || ''
            }))
          }
        },
        include: {
          user: userId ? {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          } : undefined,
          store: {
            include: {
              franchise: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          address: addressId ? true : undefined,
          items: {
            include: {
              service: true
            }
          }
        }
      })

      // Log the order creation activity
      await logActivity({
        type: 'ORDER_PLACED',
        description: `Order ${order.orderNumber} placed for ₹${order.totalAmount}`,
        userId: order.userId,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          storeId: order.storeId,
          storeName: order.store.name,
          franchiseName: order.store.franchise.name,
          customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Walk-in Customer'
        }
      })

      return NextResponse.json({
        success: true,
        order,
        message: 'Order created successfully'
      })
    } catch (dbError) {
      console.error('Database error creating order:', dbError)
      return NextResponse.json(
        { error: 'Failed to create order in database' },
        { status: 500 }
      )
    }
  } catch (err) {
    console.error('orders POST error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}