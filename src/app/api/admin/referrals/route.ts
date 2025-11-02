import { NextResponse } from 'next/server'
import { prisma } from '../../../../../src/lib/prisma'
import requireAdminHybrid from '../../../../../src/lib/hybrid-auth'
import { ReferralStatus } from '@prisma/client'

export async function GET(req: Request) {
  try {
    const auth = await requireAdminHybrid(req)
    if (auth instanceof NextResponse && auth.status === 401) return auth

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const referrerId = searchParams.get('referrerId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const whereClause = {
      ...(status && status !== 'all' && { status: status as ReferralStatus }),
      ...(referrerId && { referrerId })
    }

    const skip = (page - 1) * limit

    const [referrals, totalCount] = await Promise.all([
      prisma.referral.findMany({
        where: whereClause,
        include: {
          referrer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          referred: {
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
      prisma.referral.count({ where: whereClause })
    ])
    
    return NextResponse.json({
      referrals,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (err) {
    console.error('referrals GET error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdminHybrid(req)
    if (auth instanceof NextResponse && auth.status === 401) return auth

    const body = await req.json()
    const { 
      referrerId,
      customCode
    } = body

    if (!referrerId) {
      return NextResponse.json({ error: 'Referrer ID is required' }, { status: 400 })
    }

    // Validate referrer exists
    const referrer = await prisma.user.findUnique({ where: { id: referrerId } })
    if (!referrer) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 })
    }

    let code = customCode
    if (!code) {
      // Generate unique code
      const baseCode = `${referrer.firstName?.substring(0, 2) || 'WL'}${Math.random().toString(36).substr(2, 6)}`.toUpperCase()
      code = baseCode
      
      // Ensure uniqueness
      let attempts = 0
      while (attempts < 5) {
        const existing = await prisma.referral.findUnique({ where: { code } })
        if (!existing) break
        code = `${baseCode}${attempts + 1}`
        attempts++
      }
    } else {
      // Check if custom code already exists
      const existing = await prisma.referral.findUnique({ where: { code: customCode } })
      if (existing) {
        return NextResponse.json({ error: 'Referral code already exists' }, { status: 400 })
      }
    }

    const referral = await prisma.referral.create({
      data: {
        code,
        referrerId
      },
      include: {
        referrer: {
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

    return NextResponse.json(referral)
  } catch (err) {
    console.error('referrals POST error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}