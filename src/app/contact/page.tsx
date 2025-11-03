"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ScrollObserver from '@/components/ScrollObserver'

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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [stores, setStores] = useState<Store[]>([])
  const [storesLoading, setStoresLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch('/api/public/stores')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        if (Array.isArray(data)) {
          setStores(data)
        }
      })
      .catch((error) => {
        console.error('Failed to fetch stores:', error)
        if (!mounted) return
        // Keep empty array on error
      })
      .finally(() => {
        if (!mounted) return
        setStoresLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    const mailtoLink = `mailto:info@washlandlaundry.in?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    )}`
    window.location.href = mailtoLink
  }

  return (
    <div className="min-h-screen">
      <ScrollObserver />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white',
        padding: '6rem 1rem 4rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            Contact Us
          </h1>
          <p style={{
            fontSize: '1.375rem',
            marginBottom: '2rem',
            opacity: '0.9',
            maxWidth: '42rem',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Get in touch with us for any questions, support, or to learn more about our laundry services. We're here to help make your life easier.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section style={{ padding: '4rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {/* Phone Contact */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#1e40af',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                📞
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#1e40af'
              }}>
                Call Us
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                Speak directly with our customer service team
              </p>
              <a
                href="tel:+919888477748"
                style={{
                  color: '#1e40af',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontSize: '1.125rem'
                }}
              >
                +91 98884 77748
              </a>
            </div>

            {/* WhatsApp Contact */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#25d366',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                💬
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#1e40af'
              }}>
                WhatsApp
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                Quick responses and instant support
              </p>
              <a
                href="https://api.whatsapp.com/send/?phone=919888477748&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#25d366',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Message on WhatsApp
              </a>
            </div>

            {/* Email Contact */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#ea4335',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                ✉️
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem',
                color: '#1e40af'
              }}>
                Email Us
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                Send us detailed inquiries or feedback
              </p>
              <a
                href="mailto:info@washlandlaundry.in"
                style={{
                  color: '#ea4335',
                  fontWeight: '600',
                  textDecoration: 'none',
                  fontSize: '1.125rem'
                }}
              >
                info@washlandlaundry.in
              </a>
            </div>
          </div>

          {/* Contact Form and Store Locations */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem'
          }}>
            {/* Contact Form */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: '#1e40af'
              }}>
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="name" style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151'
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="phone" style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151'
                    }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" style={{
                      display: 'block',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#374151'
                    }}>
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Service Request">Service Request</option>
                      <option value="Franchise Inquiry">Franchise Inquiry</option>
                      <option value="Complaint">Complaint</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" style={{
                    display: 'block',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#374151'
                  }}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1e40af',
                    color: 'white',
                    fontWeight: '600',
                    padding: '0.75rem 2rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Store Locations */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: '#1e40af'
              }}>
                Our Locations
              </h2>

              {storesLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  Loading store locations...
                </div>
              ) : stores.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No stores available at the moment.
                </div>
              ) : (
                <>
                  {stores.map((store, index) => (
                    <div key={store.id} style={{ marginBottom: index < stores.length - 1 ? '2rem' : '0' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        color: '#374151'
                      }}>
                        {store.name}
                      </h3>
                      <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                        {store.address}<br />
                        {store.city}, {store.state} {store.pincode}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        <strong>Phone:</strong> {store.phone}<br />
                        <strong>Email:</strong> {store.email}
                      </p>
                    </div>
                  ))}

                  <Link
                    href="/locations"
                    style={{
                      color: '#1e40af',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '1.5rem'
                    }}
                  >
                    View All Locations →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '2rem',
            color: '#1e40af'
          }}>
            Business Hours
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            maxWidth: '60rem',
            margin: '0 auto'
          }}>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '2rem',
              borderRadius: '0.75rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                Weekdays
              </h3>
              <p style={{ fontSize: '1.125rem', color: '#64748b' }}>
                Monday - Friday<br />
                7:00 AM - 8:00 PM
              </p>
            </div>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '2rem',
              borderRadius: '0.75rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                Saturday
              </h3>
              <p style={{ fontSize: '1.125rem', color: '#64748b' }}>
                Saturday<br />
                8:00 AM - 6:00 PM
              </p>
            </div>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '2rem',
              borderRadius: '0.75rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                Sunday
              </h3>
              <p style={{ fontSize: '1.125rem', color: '#64748b' }}>
                Sunday<br />
                9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}