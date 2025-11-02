"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RiderDashboard() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const r = localStorage.getItem('userRole')
    if (r !== 'rider') return router.push('/rider/login')
    setReady(true)
  }, [router])

  function signOut() {
    localStorage.removeItem('userRole')
    router.push('/')
  }

  if (!ready) return null

  return (
    <div style={{ maxWidth: 900, margin: '3rem auto', padding: '1rem' }}>
      <h1>Rider Dashboard</h1>
      <p>Rider workspace — route assignments and pickup list will appear here.</p>
      <div style={{ marginTop: 18 }}>
        <button onClick={signOut} style={{ padding: '0.5rem 0.9rem' }}>Sign out</button>
      </div>
    </div>
  )
}
