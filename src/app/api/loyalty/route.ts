import { prisma } from '../../../lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === 'add-points') {
      const { userId, points, source = 'ORDER', expiresInDays } = body
      if (!userId || !points) return new Response(JSON.stringify({ error: 'missing userId or points' }), { status: 400 })
      const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : undefined
      const lp = await prisma.loyaltyPoint.create({
        data: { userId, points: Number(points), source, expiresAt },
      })
      return new Response(JSON.stringify(lp), { status: 201 })
    }

    if (action === 'redeem') {
      const { userId, pointsToRedeem } = body
      if (!userId || !pointsToRedeem) return new Response(JSON.stringify({ error: 'missing userId or pointsToRedeem' }), { status: 400 })

      // Sum available points (non-expired)
      const now = new Date()
      const pts = await prisma.loyaltyPoint.findMany({ where: { userId, expiresAt: { gt: now } } })
      const total = pts.reduce((s, p) => s + p.points, 0)
      if (total < pointsToRedeem) return new Response(JSON.stringify({ error: 'not enough points' }), { status: 400 })

      // Create a negative loyaltyPoint entry to represent redemption
      const redemption = await prisma.loyaltyPoint.create({
        data: {
          userId,
          points: -Math.abs(Number(pointsToRedeem)),
          source: 'REDEMPTION',
        },
      })

      // Credit wallet equivalent (1 point = ₹1)
      const creditAmount = Number(pointsToRedeem)
      const wallet = await prisma.wallet.upsert({
        where: { userId },
        update: { balance: { decrement: creditAmount } as any },
        create: { userId, balance: -creditAmount as any },
      })

      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEBIT',
          amount: creditAmount as any,
          source: 'POINTS_REDEMPTION',
        },
      })

      return new Response(JSON.stringify({ redemption }), { status: 200 })
    }

    return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'server error' }), { status: 500 })
  }
}
