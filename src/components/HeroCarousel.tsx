'use client'

import React, { useEffect, useRef, useState } from 'react'

export default function HeroCarousel() {
  // Keep two local images for immediate render; third image will be loaded from API (active offers)
  const FALLBACK = ['/hero-laundry-1.svg','/hero-delivery-1.svg']
  const FALLBACK_THIRD = '/offer-first-order.svg'
  const [images, setImages] = useState<string[]>(FALLBACK)
  const [index, setIndex] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    let mounted = true
    // fetch third image (admin-configured) and append it to the two local images
    fetch('/api/hero-carousel')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        if (data?.images && Array.isArray(data.images) && data.images.length) {
          const apiFirst = data.images[0]
          const nextImages = [...FALLBACK]
          nextImages.push(apiFirst || FALLBACK_THIRD)
          setImages(nextImages)
        } else {
          // no api images: ensure we still have a third fallback in UI
          setImages([...FALLBACK, FALLBACK_THIRD])
        }
      })
      .catch(() => {})

    return () => { mounted = false }
  }, [])

  // Start auto-advance only when there are at least 2 images.
  useEffect(() => {
    // ensure index is within bounds when images array changes
    setIndex((i) => {
      if (!images.length) return 0
      if (i >= images.length) return 0
      return i
    })

    if (images.length > 1) {
      startAuto()
      return stopAuto
    }

    // ensure any existing timer is cleared when images length <= 1
    stopAuto()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images])

  function startAuto() {
    stopAuto()
    if (images.length <= 1) return
    timer.current = window.setInterval(() => {
      setIndex((i) => {
        // guard against images length changing to 0
        const len = images.length || 1
        return (i + 1) % len
      })
    }, 4500)
  }
  function stopAuto() {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }

  function prev() {
    if (images.length <= 1) return
    stopAuto()
    setIndex((i) => (i - 1 + images.length) % images.length)
    startAuto()
  }
  function next() {
    if (images.length <= 1) return
    stopAuto()
    setIndex((i) => (i + 1) % images.length)
    startAuto()
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {(() => {
        const len = images.length || 1
        const innerWidth = `${len * 100}%`
        const slidePercent = images.length ? (index * 100) / images.length : 0
        const childWidth = `${100 / len}%`
        return (
          <div style={{ display: 'flex', transition: 'transform 600ms ease', transform: `translateX(-${slidePercent}%)`, width: innerWidth }}>
            {images.map((src, i) => (
              <div key={i} style={{ width: childWidth, flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 12 }}>
                <div
                  style={{
                    width: '100%',
                    borderRadius: 18,
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#fff',
                    boxShadow: '0 18px 40px rgba(49,145,151,0.08), 0 8px 24px rgba(175,0,45,0.06)',
                    transition: 'transform 300ms ease, box-shadow 300ms ease',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 22px 48px rgba(49,145,151,0.14), 0 12px 30px rgba(175,0,45,0.10)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 18px 40px rgba(49,145,151,0.08), 0 8px 24px rgba(175,0,45,0.06)'
                  }}
                >
                  <img src={src} alt={`hero-${i}`} loading="lazy" style={{ width: '100%', height: '60vh', objectFit: 'cover', display: 'block' }} />
                  {/* subtle overlay to tie into hero palette */}
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.02) 40%, rgba(49,145,151,0.04) 100%)' }} />
                </div>
              </div>
            ))}
          </div>
        )
      })()}

  {/* arrow controls removed per user request */}

      {/* dots */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 12, display: 'flex', gap: 8 }}>
        {images.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`Show ${i+1}`} style={{ width: 10, height: 10, borderRadius: '50%', border: 'none', background: i === index ? 'white' : 'rgba(255,255,255,0.5)' }} />
        ))}
      </div>
    </div>
  )
}
