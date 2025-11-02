"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FranchiseDashboard() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const r = localStorage.getItem('userRole')
    // Check for both 'FRANCHISE_ADMIN' (new format) and 'franchise' (legacy format)
    if (r !== 'FRANCHISE_ADMIN' && r !== 'franchise') return router.push('/franchise/login')
    setReady(true)
  }, [router])

  function signOut() {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    
    // Dispatch event to notify Header component
    window.dispatchEvent(new CustomEvent('auth:session', { detail: null }))
    
    router.push('/')
  }

  if (!ready) return null

  return (
    <div style={{ maxWidth: 900, margin: '3rem auto', padding: '1rem' }}>
      <h1>Franchise Admin Dashboard</h1>
      <p>Welcome, franchise admin. Franchise-level controls will be available here.</p>
      <div style={{ marginTop: 18 }}>
        <button onClick={signOut} style={{ padding: '0.5rem 0.9rem' }}>Sign out</button>
      </div>
    </div>
  )
}
