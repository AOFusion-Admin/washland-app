"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ScrollObserver from '@/components/ScrollObserver'

export default function FranchisePage() {
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
            Become a Washland Franchise Owner
          </h1>
          <p style={{
            fontSize: '1.375rem',
            marginBottom: '2rem',
            opacity: '0.9',
            maxWidth: '42rem',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Join India's fastest-growing laundry service network. Own a profitable business with our proven model, comprehensive support, and growing demand for professional laundry services.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link
              href="#contact"
              style={{
                backgroundColor: 'white',
                color: '#1e40af',
                fontWeight: '600',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '1.125rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              📞 Get Franchise Details
            </Link>
            <a
              href="tel:+919876543210"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                fontWeight: '600',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '1.125rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📞 Call +91 98765 43210
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Washland Franchise */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              Why Choose Washland Franchise?
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '42rem', margin: '0 auto' }}>
              Join a successful network with proven systems, comprehensive training, and ongoing support to ensure your business success.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', marginBottom: '4rem' }}>
            <div className="card fade-in" style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              animationDelay: '100ms'
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
                boxShadow: '0 4px 6px rgba(30, 64, 175, 0.3)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>💰</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1e40af' }}>
                High Profit Margins
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Enjoy attractive profit margins of 35-45% with our efficient operations model. Low overhead costs and high demand ensure consistent profitability.
              </p>
            </div>

            <div className="card fade-in" style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              animationDelay: '200ms'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#059669',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 4px 6px rgba(5, 150, 105, 0.3)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>🚀</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#059669' }}>
                Quick ROI
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Return on investment within 12-18 months. Our proven business model and market demand ensure fast break-even and profitability.
              </p>
            </div>

            <div className="card fade-in" style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              animationDelay: '300ms'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#dc2626',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 4px 6px rgba(220, 38, 38, 0.3)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>🏆</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#dc2626' }}>
                Brand Recognition
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Leverage our established brand reputation and marketing campaigns. Benefit from national advertising and customer loyalty programs.
              </p>
            </div>

            <div className="card fade-in" style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              animationDelay: '400ms'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#7c3aed',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 4px 6px rgba(124, 58, 237, 0.3)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>📚</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#7c3aed' }}>
                Comprehensive Training
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Complete training program covering operations, customer service, marketing, and business management. Ongoing support ensures success.
              </p>
            </div>

            <div className="card fade-in" style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              animationDelay: '500ms'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#ea580c',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 4px 6px rgba(234, 88, 12, 0.3)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>🎯</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#ea580c' }}>
                Territory Protection
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Exclusive territory rights ensure no competition within your designated area. Focus on building your business without market overlap.
              </p>
            </div>

            <div className="card fade-in" style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              animationDelay: '600ms'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#0891b2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 4px 6px rgba(8, 145, 178, 0.3)'
              }}>
                <span style={{ fontSize: '2rem', color: 'white' }}>📊</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#0891b2' }}>
                Technology Support
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Access to our proprietary software for order management, customer tracking, and business analytics. Stay ahead with modern technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Details */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              Investment & Requirements
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '42rem', margin: '0 auto' }}>
              Start your entrepreneurial journey with a reasonable investment and clear path to success.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '4rem' }}>
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '2rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1e40af' }}>
                Investment Range
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e40af', marginBottom: '1rem' }}>
                ₹15-25 Lakhs
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  Franchise Fee: ₹5 Lakhs
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  Equipment & Setup: ₹8-15 Lakhs
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  Working Capital: ₹2-5 Lakhs
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  Marketing & Branding: ₹1-2 Lakhs
                </li>
              </ul>
            </div>

            <div style={{
              backgroundColor: '#f9fafb',
              padding: '2rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#059669' }}>
                Space Requirements
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#059669', marginBottom: '1rem' }}>
                800-1500 sq ft
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  Ground floor commercial space
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  High footfall residential/commercial area
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  Parking space for customers
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  3-phase electrical connection
                </li>
              </ul>
            </div>

            <div style={{
              backgroundColor: '#f9fafb',
              padding: '2rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#dc2626' }}>
                Franchise Terms
              </h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#dc2626', marginBottom: '1rem' }}>
                5 Years
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  Agreement Duration: 5 years
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  Royalty: 8% of monthly revenue
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  Marketing Fee: 2% of monthly revenue
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                  Renewable agreement
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section style={{ padding: '5rem 1rem', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              How to Get Started
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '42rem', margin: '0 auto' }}>
              Simple 4-step process to become a Washland franchise owner
            </p>
          </div>

          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {[
              {
                step: '1',
                title: 'Initial Inquiry',
                desc: 'Contact us to express your interest and learn about available territories.',
                icon: '📞'
              },
              {
                step: '2',
                title: 'Site Selection & Evaluation',
                desc: 'Our team helps you find and evaluate the perfect location for your franchise.',
                icon: '📍'
              },
              {
                step: '3',
                title: 'Training & Setup',
                desc: 'Complete training program and assistance with store setup and operations.',
                icon: '🎓'
              },
              {
                step: '4',
                title: 'Launch & Support',
                desc: 'Grand opening support and ongoing assistance for continued success.',
                icon: '🚀'
              }
            ].map((item, index) => (
              <div key={index} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '5rem',
                  height: '5rem',
                  backgroundColor: '#1e40af',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontWeight: '700',
                  fontSize: '1.5rem',
                  boxShadow: '0 4px 6px rgba(30, 64, 175, 0.3)'
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.6' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section style={{ padding: '5rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              Success Stories
            </h2>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', maxWidth: '42rem', margin: '0 auto' }}>
              Hear from our successful franchise owners
            </p>
          </div>

          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {[
              {
                name: 'Rajesh Kumar',
                location: 'Hyderabad',
                revenue: '₹8 Lakhs/month',
                quote: 'Washland franchise has exceeded my expectations. The support system is excellent and the brand recognition helps attract customers immediately.',
                avatar: '👨'
              },
              {
                name: 'Priya Sharma',
                location: 'Bangalore',
                revenue: '₹12 Lakhs/month',
                quote: 'From day one, I had complete training and ongoing support. The business model is proven and profitable. Highly recommended for entrepreneurs.',
                avatar: '👩'
              },
              {
                name: 'Amit Patel',
                location: 'Mumbai',
                revenue: '₹6 Lakhs/month',
                quote: 'The ROI was faster than expected. Washland provides everything needed for success - from marketing to operations support.',
                avatar: '👨'
              }
            ].map((story, index) => (
              <div key={index} style={{
                backgroundColor: '#f9fafb',
                padding: '2rem',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem', marginRight: '1rem' }}>{story.avatar}</div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                      {story.name}
                    </h4>
                    <p style={{ color: '#6b7280', margin: '0.25rem 0', fontSize: '0.875rem' }}>
                      {story.location} • {story.revenue}
                    </p>
                  </div>
                </div>
                <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                  "{story.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '5rem 1rem', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', opacity: '0.9', maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Take the first step towards owning a successful Washland franchise. Contact our franchise team today!
          </p>

          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '3rem', maxWidth: '60rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '0.75rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📞</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Call Us
              </h3>
              <p style={{ opacity: '0.9', marginBottom: '1rem' }}>
                Speak directly with our franchise team
              </p>
              <a
                href="tel:+919876543210"
                style={{
                  backgroundColor: 'white',
                  color: '#1e40af',
                  fontWeight: '600',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '1rem'
                }}
              >
                +91 98765 43210
              </a>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '0.75rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Email Us
              </h3>
              <p style={{ opacity: '0.9', marginBottom: '1rem' }}>
                Send us your franchise inquiry
              </p>
              <a
                href="mailto:franchise@washlandlaundry.in"
                style={{
                  backgroundColor: 'white',
                  color: '#1e40af',
                  fontWeight: '600',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '1rem'
                }}
              >
                franchise@washlandlaundry.in
              </a>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '0.75rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                WhatsApp
              </h3>
              <p style={{ opacity: '0.9', marginBottom: '1rem' }}>
                Quick responses via WhatsApp
              </p>
              <a
                href="https://wa.me/919876543210"
                style={{
                  backgroundColor: '#25d366',
                  color: 'white',
                  fontWeight: '600',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '1rem'
                }}
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            borderRadius: '0.75rem',
            backdropFilter: 'blur(10px)',
            maxWidth: '40rem',
            margin: '0 auto'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
              Franchise Application Form
            </h3>
            <p style={{ opacity: '0.9', marginBottom: '1.5rem' }}>
              Fill out our quick application form and we'll get back to you within 24 hours.
            </p>
            <Link
              href="/franchise/login"
              style={{
                backgroundColor: 'white',
                color: '#1e40af',
                fontWeight: '600',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '1.125rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#111827', color: 'white', padding: '3rem 1rem 1rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <Image
                  src="/logo2.png"
                  alt="Washland Logo"
                  width={32}
                  height={32}
                  style={{ marginRight: '0.75rem' }}
                />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Washland</h3>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Premium dry cleaning and laundry services with convenient pickup & delivery across multiple franchise locations.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <a href="#" style={{ color: '#9ca3af', fontSize: '1.25rem' }} title="Facebook">📘</a>
                <a href="#" style={{ color: '#9ca3af', fontSize: '1.25rem' }} title="Instagram">📷</a>
                <a href="#" style={{ color: '#9ca3af', fontSize: '1.25rem' }} title="Twitter">🐦</a>
                <a href="#" style={{ color: '#9ca3af', fontSize: '1.25rem' }} title="LinkedIn">💼</a>
                <a href="https://wa.me/919876543210" style={{ color: '#9ca3af', fontSize: '1.25rem' }} title="WhatsApp">💬</a>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem' }}>Services</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="/book-service" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Dry Cleaning</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/book-service" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Laundry Service</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/book-service" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Shoe Cleaning</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/book-service" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Saree Care</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/book-service" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Bag & Leather Cleaning</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/book-service" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Curtain Cleaning</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#about" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>About Us</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#locations" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Locations</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/franchise" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Franchise</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="/contact" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem' }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '1rem' }}>Contact Info</h4>
              <div style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  <strong>Phone:</strong><br />
                  +91 98765 43210
                </p>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  <strong>Email:</strong><br />
                  washland.drycleaners@gmail.com
                </p>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #374151', paddingTop: '1rem', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: '0.5rem 0' }}>
              Payments: UPI, Credit/Debit cards (Razorpay) · WhatsApp: +91 98765 43210
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
              © 2025 Washland. All rights reserved. Powered by <a href="https://anvayuone.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>AnvayuOne</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}