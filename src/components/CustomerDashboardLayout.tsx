"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ToastProvider'
import UnifiedSidebar from '@/components/UnifiedSidebar'

interface CustomerDashboardLayoutProps {
  children: React.ReactNode
  currentPage?: string
  userEmail?: string
  userName?: string
}

export default function CustomerDashboardLayout({ 
  children, 
  currentPage = 'dashboard',
  userEmail,
  userName 
}: CustomerDashboardLayoutProps) {
  const router = useRouter()
  const toast = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const checkAuth = useCallback(() => {
    const userRole = localStorage.getItem('userRole')
    const userId = localStorage.getItem('userId')
    const storedEmail = localStorage.getItem('userEmail')
    
    if (userRole !== 'CUSTOMER') {
      toast.error('Access Denied', 'Customer access required')
      router.push('/auth/signin')
      return
    }

    if (!userId) {
      toast.error('Authentication Required', 'Please sign in to continue')
      router.push('/auth/signin')
      return
    }

    setUser({
      id: userId,
      email: storedEmail || userEmail,
      name: userName || 'Customer'
    })
    setLoading(false)
  }, [router, userEmail, userName]) // Remove toast from dependencies

  useEffect(() => {
    checkAuth()
  }, []) // Only run once on mount

  const handleSignOut = useCallback(() => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    
    window.dispatchEvent(new CustomEvent('auth:session', { detail: null }))
    toast.success('Signed Out', 'You have been successfully signed out.')
    router.push('/')
  }, [toast, router])

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280' }}>Loading...</p>
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <UnifiedSidebar 
        userRole="CUSTOMER"
        userName={user?.name}
        userEmail={user?.email}
        onSignOut={handleSignOut}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      <main style={{ 
        flex: 1, 
        marginLeft: isCollapsed ? '80px' : '280px',
        padding: '2rem',
        overflow: 'auto',
        transition: 'margin-left 0.3s ease'
      }}>
        {children}
      </main>
    </div>
  )
}