"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

interface Store {
  id: string
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  hours: {
    weekday: string
    saturday: string
    sunday: string
  }
  services: string[]
}

export default function LocationsPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/public/stores')
        if (!response.ok) {
          throw new Error('Failed to fetch stores')
        }
        const data = await response.json()
        setStores(data)
      } catch (err: any) {
        console.error('Error fetching stores:', err)
        setError(err.message || 'Failed to load stores')
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "3rem", height: "3rem", border: "4px solid #e5e7eb", borderTop: "4px solid #1e40af", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }}></div>
          <p style={{ color: "#6b7280" }}>Loading store locations...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "32rem", padding: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
            Unable to Load Locations
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#1e40af",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      {/* Header is provided globally via src/components/Header and included in layout.tsx */}

      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "700", color: "#111827", marginBottom: "1rem" }}>
            Our Locations
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#6b7280", maxWidth: "36rem", margin: "0 auto" }}>
            Find a Washland location near you. We offer pickup and delivery services for your convenience.
          </p>
        </div>

        {stores.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏪</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginBottom: "0.5rem" }}>
              No Stores Available
            </h2>
            <p style={{ color: "#6b7280" }}>
              We're currently setting up our store locations. Please check back soon!
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", marginBottom: "3rem" }}>
            {stores.map((store) => (
              <div key={store.id} className="card">
                <div style={{ marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1e40af", marginBottom: "0.5rem" }}>
                    {store.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "start", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <svg style={{ width: "1.25rem", height: "1.25rem", color: "#6b7280", marginTop: "0.125rem", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
                        {store.address}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
                        {store.city}, {store.state} {store.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "1rem" }}>
                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "500", color: "#111827", marginBottom: "0.5rem" }}>
                      Contact Information
                    </h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <svg style={{ width: "1rem", height: "1rem", color: "#6b7280" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{store.phone}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg style={{ width: "1rem", height: "1rem", color: "#6b7280" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{store.email}</span>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "500", color: "#111827", marginBottom: "0.5rem" }}>
                      Hours of Operation
                    </h4>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: "1.5" }}>
                      <div>Monday - Friday: {store.hours.weekday}</div>
                      <div>Saturday: {store.hours.saturday}</div>
                      <div>Sunday: {store.hours.sunday}</div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "500", color: "#111827", marginBottom: "0.5rem" }}>
                      Services Available
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {store.services.map((service, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#eff6ff",
                            color: "#1e40af",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.25rem"
                          }}
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <Link
                      href="/book-service"
                      className="btn-primary"
                      style={{
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        padding: "0.5rem 1rem",
                        flex: 1,
                        textAlign: "center"
                      }}
                    >
                      Book Service
                    </Link>
                    <button
                      onClick={() => window.open(`tel:${store.phone}`, '_self')}
                      style={{
                        backgroundColor: "transparent",
                        color: "#1e40af",
                        border: "1px solid #1e40af",
                        fontWeight: "500",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        flex: 1
                      }}
                    >
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Area Info */}
        <div className="card" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginBottom: "1rem" }}>
            Pickup & Delivery Service Area
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: "1rem" }}>
            We offer convenient pickup and delivery services within a 12 km radius of each location.
            Same-day and next-day service available for most items.
          </p>
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", maxWidth: "48rem", margin: "0 auto" }}>
            <div style={{ padding: "1rem", backgroundColor: "#f0f9ff", borderRadius: "0.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "500", color: "#1e40af", marginBottom: "0.5rem" }}>Same Day</h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Drop off by 10 AM, ready by 6 PM</p>
            </div>
            <div style={{ padding: "1rem", backgroundColor: "#f0f9ff", borderRadius: "0.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "500", color: "#1e40af", marginBottom: "0.5rem" }}>Next Day</h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Drop off by 6 PM, ready next day</p>
            </div>
            <div style={{ padding: "1rem", backgroundColor: "#f0f9ff", borderRadius: "0.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "500", color: "#1e40af", marginBottom: "0.5rem" }}>Express</h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>3-hour service available</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginBottom: "1rem" }}>
            Ready to Get Started?
          </h2>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/book-service"
              className="btn-primary"
              style={{
                textDecoration: "none",
                fontSize: "1rem",
                padding: "0.75rem 1.5rem"
              }}
            >
              Book Service Now
            </Link>
            <Link
              href="/auth/signup"
              style={{
                backgroundColor: "transparent",
                color: "#1e40af",
                border: "1px solid #1e40af",
                fontWeight: "500",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontSize: "1rem"
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}