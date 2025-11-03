import { NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'
import requireAdminHybrid from '../../../../../src/lib/hybrid-auth'

export async function GET(req: Request) {
  try {
    const auth = await requireAdminHybrid(req, ['SUPER_ADMIN', 'STORE_ADMIN'])
    if (auth instanceof NextResponse && auth.status === 401) return auth

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    const whereClause = {
      ...(category && category !== 'all' && { category }),
      ...(isActive !== null && isActive !== undefined && { isActive: isActive === 'true' })
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        storeServices: {
          include: {
            store: {
              include: {
                franchise: true
              }
            }
          }
        },
        _count: {
          select: {
            orderItems: true,
            storeServices: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(services)
  } catch (err) {
    console.error('services GET error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdminHybrid(req, ['SUPER_ADMIN', 'STORE_ADMIN'])
    if (auth instanceof NextResponse && auth.status === 401) return auth

    const body = await req.json()
    const { 
      name, 
      description, 
      basePrice, 
      category,
      isActive = true
    } = body

    if (!name || !basePrice || !category) {
      return NextResponse.json({ error: 'Name, base price, and category are required' }, { status: 400 })
    }

    // Validate basePrice is a valid number
    const price = parseFloat(basePrice)
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ error: 'Base price must be a valid positive number' }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        name,
        description: description || '',
        basePrice: price,
        category,
        isActive
      },
      include: {
        storeServices: {
          include: {
            store: {
              include: {
                franchise: true
              }
            }
          }
        },
        _count: {
          select: {
            orderItems: true,
            storeServices: true
          }
        }
      }
    })

    return NextResponse.json(service)
  } catch (err) {
    console.error('services POST error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}