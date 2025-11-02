"use client"

import React from 'react'
import Link from 'next/link'

export type Store = {
  id: string
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  lat: number | null
  lon: number | null
  hours: {
    weekday: string
    saturday: string
    sunday: string
  }
  services: string[]
}

export default function NearbyStoreBanner({ store, distanceKm }: { store: Store; distanceKm: number }) {
  return (
    <div style={{ backgroundColor: '#ecfeff', border: '1px solid #67e8f9', padding: '0.5rem 1rem', borderRadius: 8, display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center', margin: '0.5rem auto', maxWidth: '80rem' }}>
      <div style={{ color: '#064e3b', fontWeight: 600 }}>{store.name} nearby</div>
      <div style={{ color: '#065f46' }}>{store.city} • {distanceKm.toFixed(1)} km</div>
      <Link href="/locations" style={{ marginLeft: 12, color: '#0ea5e9', fontWeight: 600 }}>View details</Link>
    </div>
  )
}
