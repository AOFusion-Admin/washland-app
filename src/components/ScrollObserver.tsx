"use client"

import { useEffect } from 'react'

export default function ScrollObserver() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        if (el.classList.contains('stagger')) {
          const children = Array.from(el.children) as HTMLElement[]
          children.forEach((child, idx) => {
            // if child already has inline animationDelay, keep it; otherwise set a small stagger
            if (!child.style.animationDelay) child.style.animationDelay = `${idx * 80}ms`
            child.classList.add('in-view')
          })
        } else {
          el.classList.add('in-view')
        }
        obs.unobserve(el)
      })
    }, { threshold: 0.12 })

    const targets = Array.from(document.querySelectorAll('.fade-in, .stagger')) as HTMLElement[]
    targets.forEach(t => observer.observe(t))

    return () => observer.disconnect()
  }, [])

  return null
}
