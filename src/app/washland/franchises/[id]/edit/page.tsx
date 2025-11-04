"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'

interface Franchise {
  id: string
  name: string
  description?: string
  admin?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  isActive: boolean
}

export default function FranchiseEditPage() {
  const router = useRouter()
  const params = useParams()
  const franchiseId = params.id as string

  const [ready, setReady] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [franchise, setFranchise] = useState<Franchise | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    adminEmail: ''
  })

  useEffect(() => {
    const r = localStorage.getItem('userRole')
    const email = localStorage.getItem('userEmail')

    if (r !== 'SUPER_ADMIN') {
      router.push('/washland/login')
      return
    }

    setUserRole(r || '')
    setUserEmail(email || '')
    setReady(true)

    loadFranchise()
  }, [router, franchiseId])

  const loadFranchise = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/franchises/${franchiseId}`)

      if (response.ok) {
        const data = await response.json()
        setFranchise(data)
        setFormData({
          name: data.name || '',
          description: data.description || '',
          adminEmail: data.admin?.email || ''
        })
      } else {
        console.error('Failed to load franchise')
        router.push('/washland/franchises')
      }
    } catch (error) {
      console.error('Error loading franchise:', error)
      router.push('/washland/franchises')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Franchise name is required')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/franchises/${franchiseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          adminEmail: formData.adminEmail.trim() || undefined
        })
      })

      if (response.ok) {
        router.push(`/washland/franchises/${franchiseId}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update franchise')
      }
    } catch (error) {
      console.error('Error updating franchise:', error)
      alert('Failed to update franchise')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    window.dispatchEvent(new CustomEvent('auth:session', { detail: null }))
    router.push('/')
  }

  if (!ready || loading) {
    return (
      <DashboardLayout
        userRole={userRole}
        userName="Washland Admin"
        userEmail={userEmail}
        onSignOut={handleSignOut}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            Loading franchise details...
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!franchise) {
    return (
      <DashboardLayout
        userRole={userRole}
        userName="Washland Admin"
        userEmail={userEmail}
        onSignOut={handleSignOut}
      >
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          Franchise not found
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      userRole={userRole}
      userName="Washland Admin"
      userEmail={userEmail}
      onSignOut={handleSignOut}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <Link
                href={`/washland/franchises/${franchise.id}`}
                style={{
                  color: '#6b7280',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}
              >
                ← Back to Franchise
              </Link>
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Edit Franchise
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Update franchise information and administrator
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              Franchise Details
            </h3>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
              {/* Franchise Name */}
              <div>
                <label
                  htmlFor="name"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}
                >
                  Franchise Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'white'
                  }}
                  placeholder="Enter franchise name"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'white',
                    resize: 'vertical'
                  }}
                  placeholder="Enter franchise description (optional)"
                />
              </div>

              {/* Admin Email */}
              <div>
                <label
                  htmlFor="adminEmail"
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}
                >
                  Franchise Admin Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    color: '#111827',
                    backgroundColor: 'white'
                  }}
                  placeholder="Enter admin email (optional)"
                />
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: '0.25rem'
                }}>
                  If the user doesn't exist, a new franchise admin account will be created
                </p>
              </div>

              {/* Current Admin Info */}
              {franchise.admin && (
                <div style={{
                  backgroundColor: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Current Administrator
                  </h4>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    <div>{franchise.admin.firstName} {franchise.admin.lastName}</div>
                    <div>{franchise.admin.email}</div>
                    {franchise.admin.phone && <div>{franchise.admin.phone}</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  backgroundColor: saving ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {saving ? (
                  <>
                    <LoadingIcon />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Save Changes
                  </>
                )}
              </button>

              <Link
                href={`/washland/franchises/${franchise.id}`}
                style={{
                  backgroundColor: 'white',
                  color: '#6b7280',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <CancelIcon />
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Icons
const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
)

const CancelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const LoadingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
)