"use client"

import { SessionProvider, useSession } from "next-auth/react"
import { useEffect } from "react"

function SessionSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    try {
      if (session && session.user) {
        // store useful session pieces for client-only components
        if (session.user.role) {
          localStorage.setItem('userRole', String(session.user.role))
        } else {
          localStorage.removeItem('userRole')
        }

        if (session.user.email) {
          localStorage.setItem('userEmail', String(session.user.email))
        } else {
          localStorage.removeItem('userEmail')
        }

        if ((session.user as any).id) {
          localStorage.setItem('userId', String((session.user as any).id))
        }

        const u = session.user as any
        if (u.name) {
          localStorage.setItem('userName', String(u.name))
        } else if (u.firstName || u.lastName) {
          localStorage.setItem('userName', `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim())
        }

        // notify any listeners that a session became available
        try {
          const detail = {
            role: String(session.user.role ?? ''),
            email: String(session.user.email ?? ''),
            id: String((session.user as any)?.id ?? ''),
            name: String((u.name ?? `${u.firstName ?? ''} ${u.lastName ?? ''}`).trim())
          }
          window.dispatchEvent(new CustomEvent('auth:session', { detail }))
        } catch (e) {
          // ignore
        }
      } else {
        // clear legacy session keys when signed out
        localStorage.removeItem('userRole')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        try {
          window.dispatchEvent(new CustomEvent('auth:session', { detail: null }))
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore storage errors (e.g., SSR or private mode)
    }
  }, [session])

  return <>{children}</>
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <SessionSync>{children}</SessionSync>
    </SessionProvider>
  )
}