"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function RiderLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem('userRole', 'rider')
      setIsLoading(false)
      router.push('/rider/dashboard')
    }, 400)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ position: 'relative' }}>
      <div className="card" style={{ maxWidth: 520, width: '100%', padding: '1.25rem', borderRadius: 12, boxShadow: '0 6px 18px rgba(15,23,42,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <Image src="/logo.png" alt="Washland" width={140} height={56} style={{ objectFit: 'contain' }} />
          <p style={{ color: '#6b7280', marginTop: 8 }}>Rider portal — sign in to view assignments</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14, color: '#374151' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 8l8.5 5L20 8" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Email
            </div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
          </label>
          <label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14, color: '#374151' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="10" rx="2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Password
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
          </label>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" style={{ background: isLoading ? '#9ca3af' : 'var(--brand-blue)', color: 'white', padding: '0.7rem 1.1rem', borderRadius: 8, border: 'none' }}>{isLoading ? 'Signing in…' : 'Sign in'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
