import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: addressId } = await params

    // Check if address belongs to customer
    const existingAddress = await prisma.address.findFirst({
      where: { 
        id: addressId,
        userId: userId
      }
    })

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // First unset all default addresses for this customer
    await prisma.address.updateMany({
      where: { 
        userId: userId,
        isDefault: true 
      },
      data: { isDefault: false }
    })

    // Set this address as default
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    })

    return NextResponse.json({
      success: true,
      address: updatedAddress,
      message: 'Default address updated successfully'
    })

  } catch (error) {
    console.error('Error setting default address:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}