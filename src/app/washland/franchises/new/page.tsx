"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { useToast } from '@/components/ToastProvider'
import { api } from '@/lib/api-client'
import Link from 'next/link'

export default function NewFranchisePage() {
  const router = useRouter()
  const toast = useToast()
  const [ready, setReady] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: ''
  })

  useEffect(() => {
    const r = localStorage.getItem('userRole')
    const email = localStorage.getItem('userEmail')
    
    if (r !== 'SUPER_ADMIN' && r !== 'washland') return router.push('/washland/login')
    
    setUserRole(r || '')
    setUserEmail(email || '')
    setReady(true)
  }, [router])

  function handleSignOut() {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    window.dispatchEvent(new CustomEvent('auth:session', { detail: null }))
    router.push('/')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/api/admin/franchises', formData)

      if (response.ok) {
        toast.success("Franchise Created", "Franchise and admin account created successfully!")
        router.push('/washland/franchises')
      } else {
        const errorData = await response.json()
        if (errorData.type === 'duplicate') {
          toast.error("Duplicate Information", errorData.error)
        } else {
          toast.error("Creation Failed", errorData.error || 'Failed to create franchise')
        }
      }
    } catch (error) {
      toast.error("Network Error", 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!ready) return null

  return (
    <DashboardLayout
      userRole={userRole}
      userName="Washland Admin"
      userEmail={userEmail}
      onSignOut={handleSignOut}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Link 
              href="/washland/franchises"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <BackIcon />
              Back to Franchises
            </Link>
          </div>
          
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#111827', 
            marginBottom: '0.5rem' 
          }}>
            Add New Franchise
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Create a new franchise location and assign an admin
          </p>
        </div>

        {/* Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Franchise Information */}
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Franchise Information
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <FormField
                  label="Franchise Name"
                  required
                  value={formData.name}
                  onChange={(value) => handleInputChange('name', value)}
                  placeholder="e.g. Washland Bangalore Central"
                />
                
                <FormField
                  label="Description"
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder="Brief description of the franchise location"
                  isTextarea
                />
              </div>
            </div>

            {/* Admin Information */}
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Franchise Admin
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <FormField
                  label="First Name"
                  required
                  value={formData.adminFirstName}
                  onChange={(value) => handleInputChange('adminFirstName', value)}
                  placeholder="John"
                />
                
                <FormField
                  label="Last Name"
                  required
                  value={formData.adminLastName}
                  onChange={(value) => handleInputChange('adminLastName', value)}
                  placeholder="Doe"
                />
                
                <FormField
                  label="Email"
                  type="email"
                  required
                  value={formData.adminEmail}
                  onChange={(value) => handleInputChange('adminEmail', value)}
                  placeholder="john.doe@example.com"
                />
                
                <FormField
                  label="Phone"
                  value={formData.adminPhone}
                  onChange={(value) => handleInputChange('adminPhone', value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <Link
                href="/washland/franchises"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '500',
                  backgroundColor: 'white'
                }}
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.adminFirstName || !formData.adminLastName || !formData.adminEmail}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {loading ? 'Creating...' : 'Create Franchise'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper Components
interface FormFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: string
  isTextarea?: boolean
}

function FormField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  type = 'text',
  isTextarea = false 
}: FormFieldProps) {
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.875rem',
    backgroundColor: 'white',
    transition: 'border-color 0.2s ease'
  }

  return (
    <div>
      <label style={{ 
        display: 'block', 
        fontSize: '0.875rem', 
        fontWeight: '500', 
        color: '#374151',
        marginBottom: '0.5rem'
      }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          style={{
            ...inputStyle,
            resize: 'vertical'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db'
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db'
          }}
        />
      )}
    </div>
  )
}

// Icons
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5"/>
    <path d="M12 19L5 12L12 5"/>
  </svg>
)
