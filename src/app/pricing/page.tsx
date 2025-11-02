"use client"

import React, { useEffect, useState } from 'react'

type Service = {
  id: string
  title: string
  description?: string
  price: number
  unit?: string
}

export default function PricingPage() {
  const [services, setServices] = useState<Service[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/pricing')
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return
        setServices(j.data || [])
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false))

    return () => { mounted = false }
  }, [])

  if (loading) return <main style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading pricing...</main>
  if (error) return <main style={{ padding: '4rem 1rem', textAlign: 'center', color: 'red' }}>Error: {error}</main>

  const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

  return (
    <main style={{ padding: '4rem 1rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Pricing</h1>
          <p style={{ color: '#6b7280' }}>Transparent pricing for all our services. Prices shown are base rates.</p>
        </div>

        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {services && services.map((s) => (
            <div key={s.id} style={{ padding: '1.25rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', background: 'white' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>{s.title}</h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{s.description}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e40af' }}>{fmt.format(s.price)}</div>
                <div style={{ color: '#6b7280' }}>{s.unit ? `/${s.unit}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
