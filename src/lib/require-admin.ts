import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { NextResponse } from "next/server"
import { UserRole } from "@prisma/client"

/**
 * Server-side helper to enforce NextAuth session + role checks inside app route handlers.
 * Returns the session.user when authorized, or returns a NextResponse (401/403) to short-circuit.
 */
export async function requireAdmin(allowedRoles: UserRole[] = ["SUPER_ADMIN"]) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const role = session.user.role as UserRole | undefined
  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return session.user
}

export default requireAdmin
