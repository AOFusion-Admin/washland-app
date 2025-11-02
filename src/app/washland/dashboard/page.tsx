"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/DashboardLayout'
import { ReactElement } from 'react'

export default function WashlandDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [ready, setReady] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [dashboardStats, setDashboardStats] = useState({
    totalFranchises: 0,
    totalStores: 0,
    activeOrders: 0,
    totalRevenue: '₹0'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') return

    // Check NextAuth session first
    if (session?.user) {
      const role = session.user.role
      if (role === 'SUPER_ADMIN') {
        setUserRole(role)
        setUserEmail(session.user.email || '')
        
        // Backup to localStorage
        localStorage.setItem('userRole', role)
        localStorage.setItem('userEmail', session.user.email || '')
        
        setReady(true)
        return
      }
    }

    // Fallback to localStorage if session is not available
    const localRole = localStorage.getItem('userRole')
    const localEmail = localStorage.getItem('userEmail')
    
    if (localRole === 'SUPER_ADMIN' || localRole === 'washland') {
      setUserRole(localRole)
      setUserEmail(localEmail || '')
      setReady(true)
      return
    }

    // If neither session nor localStorage has valid auth, redirect to login
    router.push('/washland/login')
  }, [session, status, router])

  // Fetch dashboard statistics
  useEffect(() => {
    if (ready) {
      fetchDashboardStats()
    }
  }, [ready])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Fetch analytics data
      const analyticsResponse = await fetch('/api/admin/analytics')
      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json()
        setDashboardStats({
          totalFranchises: analytics.totalFranchises || 0,
          totalStores: analytics.totalStores || 0,
          activeOrders: analytics.activeOrders || 0,
          totalRevenue: `₹${(analytics.totalRevenue || 0).toLocaleString('en-IN')}`
        })
      } else {
        // Fallback: fetch individual endpoints
        const [franchisesRes, storesRes, ordersRes] = await Promise.all([
          fetch('/api/admin/franchises'),
          fetch('/api/admin/stores'),
          fetch('/api/admin/orders?status=IN_PROGRESS,CONFIRMED,READY_FOR_PICKUP,PENDING')
        ])

        const franchises = franchisesRes.ok ? await franchisesRes.json() : []
        const stores = storesRes.ok ? await storesRes.json() : []
        const orders = ordersRes.ok ? await ordersRes.json() : []

        // Calculate total revenue from orders
        const revenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)

        setDashboardStats({
          totalFranchises: franchises.length || 0,
          totalStores: stores.length || 0,
          activeOrders: orders.length || 0,
          totalRevenue: `₹${revenue.toLocaleString('en-IN')}`
        })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleSignOut() {
    // Clear localStorage
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    
    // Dispatch event to notify Header component
    window.dispatchEvent(new CustomEvent('auth:session', { detail: null }))
    
    // Sign out of NextAuth session too
    if (session) {
      window.location.href = '/api/auth/signout'
    } else {
      router.push('/')
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
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Dashboard Overview */}
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#111827', 
            marginBottom: '0.5rem' 
          }}>
            Dashboard Overview
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            Welcome to Washland Super Admin Dashboard. Manage your entire laundry network from here.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem' 
        }}>
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #f3f4f6'
              }}>
                <div style={{
                  height: '20px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                  marginBottom: '0.5rem'
                }} />
                <div style={{
                  height: '32px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  marginBottom: '0.25rem'
                }} />
                <div style={{
                  height: '16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                  width: '60%'
                }} />
              </div>
            ))
          ) : (
            <>
              <StatCard
                title="Total Franchises"
                value={dashboardStats.totalFranchises.toString()}
                change={dashboardStats.totalFranchises > 0 ? `${dashboardStats.totalFranchises} active` : "No franchises yet"}
                color="#10b981"
                icon={<FranchiseIcon />}
              />
              <StatCard
                title="Total Stores"
                value={dashboardStats.totalStores.toString()}
                change={dashboardStats.totalStores > 0 ? `${dashboardStats.totalStores} locations` : "No stores yet"}
                color="#3b82f6"
                icon={<StoreIcon />}
              />
              <StatCard
                title="Active Orders"
                value={dashboardStats.activeOrders.toString()}
                change={dashboardStats.activeOrders > 0 ? "Orders in progress" : "No active orders"}
                color="#f59e0b"
                icon={<OrdersIcon />}
              />
              <StatCard
                title="Total Revenue"
                value={dashboardStats.totalRevenue}
                change={dashboardStats.totalRevenue !== '₹0' ? "From completed orders" : "No revenue yet"}
                color="#ef4444"
                icon={<RevenueIcon />}
              />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#111827'
          }}>
            Quick Actions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <QuickActionCard
              title="Add New Franchise"
              description="Create a new franchise location"
              href="/washland/franchises/new"
              icon={<PlusIcon />}
              color="#10b981"
            />
            <QuickActionCard
              title="Add New Store"
              description="Add a store under existing franchise"
              href="/washland/stores/new"
              icon={<PlusIcon />}
              color="#3b82f6"
            />
            <QuickActionCard
              title="Manage Users"
              description="Add or edit user accounts"
              href="/washland/users"
              icon={<UsersIcon />}
              color="#8b5cf6"
            />
            <QuickActionCard
              title="View All Orders"
              description="Monitor order status across network"
              href="/washland/orders"
              icon={<OrdersIcon />}
              color="#f59e0b"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#111827'
          }}>
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ActivityItem
              title="New franchise added in Bangalore"
              time="2 hours ago"
              type="franchise"
            />
            <ActivityItem
              title="Store manager John Doe logged in"
              time="3 hours ago"
              type="user"
            />
            <ActivityItem
              title="45 new orders received today"
              time="5 hours ago"
              type="order"
            />
            <ActivityItem
              title="Monthly revenue target achieved"
              time="1 day ago"
              type="revenue"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper Components
interface StatCardProps {
  title: string
  value: string
  change: string
  color: string
  icon: ReactElement
}

function StatCard({ title, value, change, color, icon }: StatCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: `1px solid ${color}20`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            {title}
          </p>
          <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
            {value}
          </p>
          <p style={{ fontSize: '0.75rem', color: color }}>
            {change}
          </p>
        </div>
        <div style={{ 
          padding: '0.75rem',
          backgroundColor: `${color}20`,
          borderRadius: '8px',
          color: color
        }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  href: string
  icon: ReactElement
  color: string
}

import Link from 'next/link'

function QuickActionCard({ title, description, href, icon, color }: QuickActionCardProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          padding: '1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: 'white'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = color
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ color: color }}>
            {icon}
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
            {title}
          </h4>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
          {description}
        </p>
      </div>
    </Link>
  )
}

interface ActivityItemProps {
  title: string
  time: string
  type: 'franchise' | 'user' | 'order' | 'revenue'
}

function ActivityItem({ title, time, type }: ActivityItemProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'franchise': return '#10b981'
      case 'user': return '#8b5cf6'
      case 'order': return '#f59e0b'
      case 'revenue': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
      <div style={{
        width: '8px',
        height: '8px',
        backgroundColor: getTypeColor(type),
        borderRadius: '50%'
      }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.875rem', color: '#111827', margin: 0 }}>
          {title}
        </p>
      </div>
      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
        {time}
      </p>
    </div>
  )
}

// Icons
const FranchiseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L22 8.5V21H2V8.5L12 2Z"/>
    <path d="M12 2V12"/>
    <path d="M8 12V21"/>
    <path d="M16 12V21"/>
  </svg>
)

const StoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7"/>
    <rect x="3" y="7" width="18" height="13" rx="1"/>
    <path d="M8 7V5"/>
    <path d="M16 7V5"/>
  </svg>
)

const OrdersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V6C4 4.89543 4.89543 4 6 4H8"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <path d="M9 14L11 16L15 12"/>
  </svg>
)

const RevenueIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5C17 13.8807 15.8807 15 14.5 15H7"/>
    <line x1="10" y1="1" x2="10" y2="5"/>
    <line x1="14" y1="19" x2="14" y2="23"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21V19C17 16.2386 14.7614 14 12 14H5C2.23858 14 0 16.2386 0 19V21"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21V19C22.9993 17.1137 21.9683 15.4628 20.4 14.8"/>
    <path d="M16 3.13C17.5312 3.74055 18.5321 5.24693 18.5321 6.995C18.5321 8.74307 17.5312 10.2495 16 10.86"/>
  </svg>
)
