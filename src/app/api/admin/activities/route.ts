import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const authResult = await requireAdmin()
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch recent activities with user information
    const activities = await prisma.activity.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    })

    // Transform activities for frontend consumption
    const transformedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      description: activity.description,
      user: activity.user ? {
        name: `${activity.user.firstName} ${activity.user.lastName}`,
        email: activity.user.email,
        role: activity.user.role
      } : null,
      metadata: activity.metadata,
      createdAt: activity.createdAt.toISOString()
    }))

    return NextResponse.json({
      activities: transformedActivities,
      total: await prisma.activity.count()
    })

  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}