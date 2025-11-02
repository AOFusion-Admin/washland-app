import { NextResponse } from 'next/server'
import { prisma } from '../../../../../../src/lib/prisma'
import requireAdminHybrid from '../../../../../../src/lib/hybrid-auth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminHybrid(req)
    if (auth instanceof NextResponse && auth.status === 401) return auth

    const { id } = await params
    
    const service = await prisma.service.findUnique({
      where: { id },
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
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    
    return NextResponse.json(service)
  } catch (err) {
    console.error('service GET error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminHybrid(req)
    if (auth instanceof NextResponse && auth.status === 401) return auth

    const { id } = await params
    const body = await req.json()
    const { 
      name, 
      description, 
      basePrice, 
      category,
      isActive
    } = body

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    })
    
    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    const updateData: {
      name?: string;
      description?: string;
      basePrice?: number;
      category?: string;
      isActive?: boolean;
    } = {}
    
    // Update service info
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (isActive !== undefined) updateData.isActive = isActive
    
    // Validate and update base price
    if (basePrice !== undefined) {
      const price = parseFloat(basePrice)
      if (isNaN(price) || price < 0) {
        return NextResponse.json({ error: 'Base price must be a valid positive number' }, { status: 400 })
      }
      updateData.basePrice = price
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedService)
  } catch (err) {
    console.error('service PUT error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminHybrid(req)
    if (auth instanceof NextResponse && auth.status === 401) return auth

    const { id } = await params

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
            storeServices: true
          }
        }
      }
    })
    
    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Check if service has order items
    if (existingService._count.orderItems > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete service with existing order items. Please disable the service instead.' 
      }, { status: 400 })
    }

    // Delete related store services first
    if (existingService._count.storeServices > 0) {
      await prisma.storeService.deleteMany({
        where: { serviceId: id }
      })
    }

    await prisma.service.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Service deleted successfully' })
  } catch (err) {
    console.error('service DELETE error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}