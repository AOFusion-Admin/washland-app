"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'
import { authenticatedFetch } from '@/lib/api-client'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
  managedFranchises?: { id: string; name: string }[]
  managedStores?: { id: string; name: string }[]
}

interface RoleStats {
  SUPER_ADMIN: number
  FRANCHISE_ADMIN: number
  STORE_ADMIN: number
  RIDER: number
  CUSTOMER: number
}

const roleDefinitions = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: ['Manage all users', 'Manage franchises', 'Manage stores', 'View all reports', 'System configuration'],
    color: '#ef4444'
  },
  FRANCHISE_ADMIN: {
    name: 'Franchise Admin',
    description: 'Manages specific franchise and its stores',
    permissions: ['Manage assigned franchise', 'Manage franchise stores', 'View franchise reports', 'Manage staff'],
    color: '#3b82f6'
  },
  STORE_ADMIN: {
    name: 'Store Admin',
    description: 'Manages specific store operations',
    permissions: ['Manage assigned store', 'Process orders', 'Manage inventory', 'View store reports'],
    color: '#10b981'
  },
  RIDER: {
    name: 'Rider',
    description: 'Handles pickup and delivery services',
    permissions: ['View assigned orders', 'Update order status', 'Manage deliveries'],
    color: '#f59e0b'
  },
  CUSTOMER: {
    name: 'Customer',
    description: 'Regular customer with access to services',
    permissions: ['Place orders', 'View order history', 'Manage profile', 'Use wallet and loyalty'],
    color: '#6b7280'
  }
}

export default function RolesPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [roleStats, setRoleStats] = useState<RoleStats>({
    SUPER_ADMIN: 0,
    FRANCHISE_ADMIN: 0,
    STORE_ADMIN: 0,
    RIDER: 0,
    CUSTOMER: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    const r = localStorage.getItem('userRole')
    const email = localStorage.getItem('userEmail')

    if (r !== 'SUPER_ADMIN' && r !== 'washland') return router.push('/washland/login')

    setUserRole(r || '')
    setUserEmail(email || '')
    setReady(true)
  }, [router])

  useEffect(() => {
    if (ready) {
      fetchUsers()
    }
  }, [ready])

  useEffect(() => {
    filterUsers()
  }, [users, selectedRole, searchTerm])

  const onSignOut = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    router.push('/washland/login')
  }

  const fetchUsers = async () => {
    try {
      const response = await authenticatedFetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data || [])
      calculateRoleStats(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const calculateRoleStats = (userList: User[]) => {
    const stats = {
      SUPER_ADMIN: 0,
      FRANCHISE_ADMIN: 0,
      STORE_ADMIN: 0,
      RIDER: 0,
      CUSTOMER: 0
    }

    userList.forEach(user => {
      if (stats[user.role as keyof RoleStats] !== undefined) {
        stats[user.role as keyof RoleStats]++
      }
    })

    setRoleStats(stats)
  }

  const filterUsers = () => {
    let filtered = users

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdatingUser(userId)
    try {
      const response = await authenticatedFetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) throw new Error('Failed to update user role')

      // Update local state
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ))

      // Recalculate stats
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
      calculateRoleStats(updatedUsers)

    } catch (err) {
      setError('Failed to update user role')
      console.error('Error updating user role:', err)
    } finally {
      setUpdatingUser(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-800'
      case 'FRANCHISE_ADMIN': return 'bg-blue-100 text-blue-800'
      case 'STORE_ADMIN': return 'bg-green-100 text-green-800'
      case 'RIDER': return 'bg-yellow-100 text-yellow-800'
      case 'CUSTOMER': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!ready) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ animation: 'spin 1s linear infinite', border: '4px solid #f3f4f6', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px' }}></div>
      </div>
    )
  }

  if (loading) {
    return (
      <DashboardLayout userRole={userRole} onSignOut={onSignOut}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ animation: 'spin 1s linear infinite', border: '4px solid #f3f4f6', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px' }}></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole={userRole} onSignOut={onSignOut}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Enhanced Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Roles & Permissions
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                Manage user roles and permissions across the entire system
              </p>
            </div>

            <Link
              href="/washland/users/new"
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
              Add New User
            </Link>
          </div>

          {/* Enhanced Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(roleStats).map(([role, count]) => (
              <RoleStatCard
                key={role}
                title={roleDefinitions[role as keyof typeof roleDefinitions]?.name}
                value={count.toString()}
                subtitle={`${count} user${count !== 1 ? 's' : ''} with this role`}
                color={roleDefinitions[role as keyof typeof roleDefinitions]?.color || '#6b7280'}
                icon={<ShieldIcon />}
              />
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        {/* Role Definitions Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <SettingsIcon />
              Role Definitions & Permissions
            </h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {Object.entries(roleDefinitions).map(([roleKey, definition]) => (
                <RoleDefinitionCard
                  key={roleKey}
                  role={roleKey}
                  definition={definition}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Filter by Role:
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="all">All Roles</option>
                {Object.entries(roleDefinitions).map(([roleKey, definition]) => (
                  <option key={roleKey} value={roleKey}>{definition.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                Search Users:
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
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
              Users ({filteredUsers.length})
            </h3>
          </div>

          {filteredUsers.length === 0 ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <UsersIcon />
              </div>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                No users found
              </h4>
              <p style={{ marginBottom: '1.5rem' }}>
                {searchTerm || selectedRole !== 'all' ? 'Try adjusting your filters.' : 'Get started by adding your first user.'}
              </p>
              <Link
                href="/washland/users/new"
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Add First User
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={tableHeaderStyle}>User</th>
                    <th style={tableHeaderStyle}>Role</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Created</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={tableCellStyle}>
                        <div>
                          <div style={{ fontWeight: '500', color: '#111827' }}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          disabled={updatingUser === user.id}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: '1px solid #d1d5db',
                            backgroundColor: 'white',
                            color: roleDefinitions[user.role as keyof typeof roleDefinitions]?.color || '#6b7280',
                            opacity: updatingUser === user.id ? 0.5 : 1,
                            cursor: updatingUser === user.id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {Object.entries(roleDefinitions).map(([roleKey, definition]) => (
                            <option key={roleKey} value={roleKey}>{definition.name}</option>
                          ))}
                        </select>
                      </td>
                      <td style={tableCellStyle}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: user.isActive ? '#dcfce7' : '#fee2e2',
                          color: user.isActive ? '#166534' : '#991b1b'
                        }}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={tableCellStyle}>
                        <Link
                          href={`/washland/users/${user.id}`}
                          style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        >
                          View Details
                        </Link>
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

// Enhanced Helper Components
interface RoleStatCardProps {
  title: string
  value: string
  subtitle: string
  color: string
  icon: React.ReactNode
}

function RoleStatCard({ title, value, subtitle, color, icon }: RoleStatCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: `1px solid ${color}20`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          padding: '0.75rem',
          borderRadius: '8px',
          backgroundColor: `${color}1a`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
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
      </div>
    </div>
  )
}

interface RoleDefinitionCardProps {
  role: string
  definition: {
    name: string
    description: string
    permissions: string[]
    color: string
  }
}

function RoleDefinitionCard({ role, definition }: RoleDefinitionCardProps) {
  return (
    <div style={{
      backgroundColor: 'white',
      border: `1px solid ${definition.color}20`,
      borderRadius: '8px',
      padding: '1.5rem',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          padding: '0.5rem',
          borderRadius: '6px',
          backgroundColor: `${definition.color}1a`,
          color: definition.color
        }}>
          <ShieldIcon />
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
            {definition.name}
          </h4>
          <span style={{
            display: 'inline-block',
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: `${definition.color}1a`,
            color: definition.color
          }}>
            {role.replace('_', ' ')}
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
        {definition.description}
      </p>

      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Permissions:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {definition.permissions.map((permission, index) => (
            <span key={index} style={{
              display: 'inline-block',
              padding: '0.125rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              backgroundColor: '#f3f4f6',
              color: '#374151'
            }}>
              {permission}
            </span>
          ))}
        </div>
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

// Enhanced Icons
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2578 9.77251 19.9887C9.5799 19.7197 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.77588 19.1409C3.67523 18.8981 3.62343 18.6378 3.62343 18.375C3.62343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.88C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"/>
  </svg>
)

const UsersIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)