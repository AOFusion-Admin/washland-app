import { NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'
import requireAdminHybrid from '../../../../../src/lib/hybrid-auth'

export async function GET(req: Request) {
  try {
    const auth = await requireAdminHybrid(req)
    if (auth instanceof NextResponse && auth.status === 401) return auth

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const source = searchParams.get('source')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const whereClause = {
      ...(userId && { userId }),
      ...(source && source !== 'all' && { source })
    }

    const skip = (page - 1) * limit

    const [loyaltyPoints, totalCount, summary] = await Promise.all([
      prisma.loyaltyPoint.findMany({
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
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.loyaltyPoint.count({ where: whereClause }),
      
      // Get loyalty summary stats
      prisma.loyaltyPoint.groupBy({
        by: ['source'],
        _sum: { points: true },
        _count: true
      })
    ])
    
    // Calculate total active points per user
    const userStats = await prisma.$queryRaw`
      SELECT 
        user_id,
        SUM(points) as total_points,
        COUNT(*) as transaction_count
      FROM loyalty_points 
      WHERE (expires_at IS NULL OR expires_at > NOW())
        ${userId ? `AND user_id = '${userId}'` : ''}
      GROUP BY user_id
      ORDER BY total_points DESC
      LIMIT 10
    `

    return NextResponse.json({
      loyaltyPoints,
      summary,
      topUsers: userStats,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (err) {
    console.error('loyalty GET error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdminHybrid(req)
    if (auth instanceof NextResponse && auth.status === 401) return auth

    const body = await req.json()
    const { 
      userId,
      points,
      source = 'MANUAL',
      expiresInDays
    } = body

    if (!userId || !points) {
      return NextResponse.json({ error: 'User ID and points are required' }, { status: 400 })
    }

    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Validate points value
    const pointValue = parseInt(points)
    if (isNaN(pointValue)) {
      return NextResponse.json({ error: 'Points must be a valid number' }, { status: 400 })
    }

    const expiresAt = expiresInDays ? 
      new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : 
      null

    const loyaltyPoint = await prisma.loyaltyPoint.create({
      data: {
        userId,
        points: pointValue,
        source,
        expiresAt
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json(loyaltyPoint)
  } catch (err) {
    console.error('loyalty POST error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}