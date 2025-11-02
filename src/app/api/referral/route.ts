import { prisma } from '../../../lib/prisma'
import { createReferralForReferrer, applyReferralCode, creditReferral } from '../../../lib/referral'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === 'create') {
      const { referrerId } = body
      if (!referrerId) return new Response(JSON.stringify({ error: 'missing referrerId' }), { status: 400 })
      const r = await createReferralForReferrer(referrerId)
      return new Response(JSON.stringify(r), { status: 201 })
    }

    if (action === 'apply') {
      const { code, referredUserId } = body
      if (!code || !referredUserId) return new Response(JSON.stringify({ error: 'missing code or referredUserId' }), { status: 400 })
      const updated = await applyReferralCode(code, referredUserId)
      return new Response(JSON.stringify(updated), { status: 200 })
    }

    if (action === 'credit') {
      const { referralId, referrerAmount = 100, referredAmount = 50 } = body
      if (!referralId) return new Response(JSON.stringify({ error: 'missing referralId' }), { status: 400 })
      const res = await creditReferral(referralId, referrerAmount, referredAmount)
      return new Response(JSON.stringify(res), { status: 200 })
    }

    return new Response(JSON.stringify({ error: 'unknown action' }), { status: 400 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'server error' }), { status: 500 })
  }
}
