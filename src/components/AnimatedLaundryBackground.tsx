"use client"

import React from 'react'

export default function AnimatedLaundryBackground({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      <svg width="160%" height="160%" viewBox="0 0 1400 1000" preserveAspectRatio="xMidYMid slice" style={{ display: 'block', opacity: 0.65, transform: 'translate(-8%, -6%)' }}>
        <style>{`
          .float1 { animation: float1 9s ease-in-out infinite; transform-origin: center; }
          .float2 { animation: float2 11s ease-in-out infinite; transform-origin: center; }
          .float3 { animation: float3 10s ease-in-out infinite; transform-origin: center; }
          .float4 { animation: float4 13s ease-in-out infinite; transform-origin: center; }

          @keyframes float1 { 0% { transform: translate(0,0) } 50% { transform: translate(40px,-28px) } 100% { transform: translate(0,0) } }
          @keyframes float2 { 0% { transform: translate(0,0) } 50% { transform: translate(-38px,-30px) } 100% { transform: translate(0,0) } }
          @keyframes float3 { 0% { transform: translate(0,0) } 50% { transform: translate(32px,-44px) } 100% { transform: translate(0,0) } }
          @keyframes float4 { 0% { transform: translate(0,0) } 50% { transform: translate(-26px,-18px) } 100% { transform: translate(0,0) } }

          @media (prefers-reduced-motion: reduce) {
            .float1, .float2, .float3, .float4 { animation: none !important; }
          }
        `}</style>

        {/* Washing machine illustration */}
  <g className="float1" transform="translate(160 600) scale(4)">
          <rect x="-44" y="-44" width="88" height="88" rx="12" fill="#f0f9ff" stroke="#cfeefc" strokeWidth="2" />
          <circle cx="0" cy="6" r="26" fill="#ffffff" stroke="#e6f8fb" strokeWidth="3" />
          <circle cx="0" cy="6" r="12" fill="#cfeefc" />
          <path d="M-12 22c4-6 12-8 24-6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Shirt illustration */}
  <g className="float2" transform="translate(1020 160) scale(4)">
          <path d="M-28 18c6-6 12-8 28-8s22 2 28 8v18c0 6-4 10-12 10H-16c-8 0-12-4-12-10V18z" fill="#fff0f2" stroke="#ffd7df" strokeWidth="2" />
          <path d="M-12 6c4-6 20-6 28 0" stroke="#ff9fb0" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Shoe illustration */}
  <g className="float3" transform="translate(880 560) scale(4)">
          <path d="M-36 10c6-6 20-10 40-6 10 2 18 8 24 14 4 4 2 12-6 14-14 4-40 4-58-4-6-3-6-10 0-18z" fill="#f0fff6" stroke="#cff7ea" strokeWidth="2" />
          <path d="M-6 0c6 2 12 2 18 0" stroke="#319197" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        </g>

        {/* Bed illustration */}
  <g className="float4" transform="translate(480 120) scale(4)">
          <rect x="-48" y="-18" width="96" height="36" rx="6" fill="#fff7ed" stroke="#ffe6cc" strokeWidth="2" />
          <rect x="-42" y="-14" width="44" height="22" rx="3" fill="#fff3e0" />
          <rect x="2" y="-14" width="44" height="22" rx="3" fill="#fff3e0" />
        </g>

        {/* Soap bubbles accents */}
  <g className="float2" transform="translate(600 340) scale(2)">
          <circle cx="0" cy="0" r="18" fill="#e6f8fb" opacity="0.95" />
          <circle cx="14" cy="-10" r="8" fill="#ffffff" opacity="0.9" />
          <circle cx="-12" cy="8" r="6" fill="#fff0f2" opacity="0.9" />
        </g>
  <g className="float3" transform="translate(240 360) scale(1.8)">
          <circle cx="0" cy="0" r="14" fill="#fff7ed" opacity="0.95" />
          <circle cx="-8" cy="-6" r="6" fill="#ffffff" opacity="0.9" />
        </g>
      </svg>
    </div>
  )
}
