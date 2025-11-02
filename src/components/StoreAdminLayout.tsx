"use client"

import { ReactNode, useState, useCallback } from 'react'
import UnifiedSidebar from '@/components/UnifiedSidebar'

interface StoreAdminLayoutProps {
  children: ReactNode
  userRole: string
  userName: string
  userEmail: string
  storeName?: string
  onSignOut: () => void
}

export default function StoreAdminLayout({
  children,
  userRole,
  userName,
  userEmail,
  storeName,
  onSignOut
}: StoreAdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <UnifiedSidebar
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
        storeName={storeName}
        onSignOut={onSignOut}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <div style={{
        marginLeft: isCollapsed ? '80px' : '280px',
        flex: 1,
        padding: '2rem',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease'
      }}>
        {children}
      </div>
    </div>
  )
}