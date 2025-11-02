"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

interface Franchise {
  id: string
  name: string
  description?: string
  admin?: {
    firstName: string
    lastName: string
    email: string
  }
  storeCount: number
  isActive: boolean
  createdAt: string
}

export default function FranchisesPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [franchises, setFranchises] = useState<Franchise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const r = localStorage.getItem('userRole')
    const email = localStorage.getItem('userEmail')
    
    console.log('Current role from localStorage:', r)
    console.log('Current email from localStorage:', email)
    
    // Allow SUPER_ADMIN instead of checking for 'washland'
    if (r !== 'SUPER_ADMIN') {
      console.log('Redirecting to login - role is not SUPER_ADMIN')
      return router.push('/washland/login')
    }
    
    setUserRole(r || '')
    setUserEmail(email || '')
    setReady(true)
    
    // Load franchises
    loadFranchises()
  }, [router])

  const loadFranchises = async () => {
    try {
      setLoading(true)
      console.log('Loading franchises...')
      const response = await fetch('/api/admin/franchises')
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)
        // API returns the franchises array directly
        setFranchises(Array.isArray(data) ? data : [])
        console.log('Franchises set:', Array.isArray(data) ? data : [])
      } else {
        const errorText = await response.text()
        console.error('Failed to load franchises:', response.status, response.statusText, errorText)
        setFranchises([])
      }
    } catch (error) {
      console.error('Error loading franchises:', error)
      setFranchises([])
    } finally {
      setLoading(false)
    }
  }

  function handleSignOut() {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    window.dispatchEvent(new CustomEvent('auth:session', { detail: null }))
    router.push('/')
  }

  if (!ready) return null

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
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#111827', 
              marginBottom: '0.5rem' 
            }}>
              Franchise Management
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Manage all franchise locations across your network
            </p>
          </div>
          
          <Link 
            href="/washland/franchises/new"
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981'
            }}
          >
            <PlusIcon />
            Add New Franchise
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <StatCard
            title="Total Franchises"
            value={franchises.length.toString()}
            subtitle="Active locations"
            color="#10b981"
          />
          <StatCard
            title="Active Franchises"
            value={franchises.filter(f => f.isActive).length.toString()}
            subtitle="Currently operating"
            color="#3b82f6"
          />
          <StatCard
            title="Total Stores"
            value={franchises.reduce((sum, f) => sum + f.storeCount, 0).toString()}
            subtitle="Across all franchises"
            color="#8b5cf6"
          />
          <StatCard
            title="This Month"
            value={(() => {
              const now = new Date()
              const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
              return franchises.filter(f => new Date(f.createdAt) >= thisMonth).length.toString()
            })()}
            subtitle="New franchises added"
            color="#f59e0b"
          />
        </div>

        {/* Franchises Table */}
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
              All Franchises
            </h3>
          </div>

          {loading ? (
            <div style={{ 
              padding: '3rem', 
              textAlign: 'center',
              color: '#6b7280'
            }}>
              Loading franchises...
            </div>
          ) : franchises.length === 0 ? (
            <div style={{ 
              padding: '3rem', 
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <FranchiseIcon />
              </div>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                No franchises found
              </h4>
              <p style={{ marginBottom: '1.5rem' }}>
                Get started by creating your first franchise location.
              </p>
              <Link 
                href="/washland/franchises/new"
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Add First Franchise
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={tableHeaderStyle}>Franchise Name</th>
                    <th style={tableHeaderStyle}>Admin</th>
                    <th style={tableHeaderStyle}>Stores</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Created</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {franchises.map((franchise) => (
                    <tr key={franchise.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={tableCellStyle}>
                        <div>
                          <div style={{ fontWeight: '500', color: '#111827' }}>
                            {franchise.name}
                          </div>
                          {franchise.description && (
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {franchise.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        {franchise.admin ? (
                          <div>
                            <div style={{ fontWeight: '500', color: '#111827' }}>
                              {franchise.admin.firstName} {franchise.admin.lastName}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {franchise.admin.email}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#6b7280' }}>No admin assigned</span>
                        )}
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {franchise.storeCount} store{franchise.storeCount !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{
                          backgroundColor: franchise.isActive ? '#dcfce7' : '#fee2e2',
                          color: franchise.isActive ? '#166534' : '#991b1b',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {franchise.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(franchise.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => router.push(`/washland/franchises/${franchise.id}`)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => router.push(`/washland/franchises/${franchise.id}/edit`)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#f59e0b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper Components
interface StatCardProps {
  title: string
  value: string
  subtitle: string
  color: string
}

function StatCard({ title, value, subtitle, color }: StatCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: `1px solid ${color}20`
    }}>
      <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
        {title}
      </div>
      <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: color }}>
        {subtitle}
      </div>
    </div>
  )
}

// Styles
const tableHeaderStyle = {
  textAlign: 'left' as const,
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#374151',
  borderBottom: '1px solid #e5e7eb'
}

const tableCellStyle = {
  padding: '1rem',
  fontSize: '0.875rem'
}

// Icons
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const FranchiseIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1">
    <path d="M12 2L22 8.5V21H2V8.5L12 2Z"/>
    <path d="M12 2V12"/>
    <path d="M8 12V21"/>
    <path d="M16 12V21"/>
  </svg>
)
