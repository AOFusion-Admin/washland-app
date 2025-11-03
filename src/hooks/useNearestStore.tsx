"use client"

import { useEffect, useState } from 'react'

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

// Temporary hardcoded stores until geocoding API is fixed
const STORES: Store[] = [
  {
    id: 'kondapur-1',
    name: 'Washland Kondapur',
    address: 'Plot 123, Kondapur Main Road, Near Botanical Garden',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500084',
    phone: '+91 40 1234 5678',
    email: 'kondapur@washlandlaundry.in',
    lat: 17.4474, // Approximate coordinates for Kondapur, Hyderabad
    lon: 78.3762,
    hours: {
      weekday: '7:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: '9:00 AM - 5:00 PM'
    },
    services: ['Dry Cleaning', 'Laundry', 'Alterations', 'Shoe Cleaning']
  }
]

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // km
  const toRad = (v: number) => (v * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function useNearestStore(maxDistanceKm = 8) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nearest, setNearest] = useState<{ store: Store; distanceKm: number } | null>(null)

  useEffect(() => {
    const fetchStoresAndFindNearest = async () => {
      try {
        // For now, use hardcoded stores until geocoding API is working
        const stores: Store[] = STORES

        // Check if geolocation is supported
        if (!('geolocation' in navigator)) {
          setError('Geolocation not supported')
          setLoading(false)
          return
        }

        const onSuccess = (pos: GeolocationPosition) => {
          const { latitude, longitude } = pos.coords
          let best: { store: Store; distanceKm: number } | null = null

          // Filter stores that have coordinates and find the nearest one
          for (const store of stores) {
            if (store.lat !== null && store.lon !== null) {
              const d = haversineKm(latitude, longitude, store.lat, store.lon)
              if (!best || d < best.distanceKm) {
                best = { store, distanceKm: d }
              }
            }
          }

          if (best && best.distanceKm <= maxDistanceKm) {
            setNearest(best)
          }
          setLoading(false)
        }

        const onError = (err: GeolocationPositionError) => {
          setError(err.message)
          setLoading(false)
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
          maximumAge: 1000 * 60 * 60, // 1 hour
          timeout: 5000
        })
      } catch (err: any) {
        console.error('Error fetching stores:', err)
        setError(err.message || 'Failed to fetch stores')
        setLoading(false)
      }
    }

    fetchStoresAndFindNearest()
  }, [maxDistanceKm])

  return { loading, error, nearest }
}
