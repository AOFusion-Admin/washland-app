"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ToastProvider'
import CustomerDashboardLayout from '@/components/CustomerDashboardLayout'

interface LoyaltyData {
  totalPoints: number
  availablePoints: number
  usedPoints: number
  pointsHistory: PointsTransaction[]
  redeemableRewards: Reward[]
}

interface PointsTransaction {
  id: string
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED'
  points: number
  description: string
  orderId?: string
  createdAt: string
}

interface Reward {
  id: string
  name: string
  description: string
  pointsRequired: number
  category: string
  isActive: boolean
}

export default function CustomerLoyaltyPage() {
  const router = useRouter()
  const toast = useToast()
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'rewards'>('overview')

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || ''
    const name = localStorage.getItem('userName') || 'Customer'
    setUserEmail(email)
    setUserName(name)
    
    fetchLoyaltyData()
  }, [])

  const fetchLoyaltyData = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const userRole = localStorage.getItem('userRole')
      const userEmail = localStorage.getItem('userEmail')

      if (!userId || userRole !== 'CUSTOMER') {
        router.push('/auth/signin')
        return
      }

      const response = await fetch('/api/customer/loyalty', {
        headers: {
          'x-user-id': userId,
          'x-user-email': userEmail || '',
          'x-user-role': userRole
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLoyaltyData(data.loyalty)
      } else {
        toast.error('Error', 'Failed to fetch loyalty data')
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error)
      toast.error('Error', 'Failed to fetch loyalty data')
    } finally {
      setLoading(false)
    }
  }

  const redeemReward = async (rewardId: string) => {
    setRedeeming(true)

    try {
      const userId = localStorage.getItem('userId')
      const userRole = localStorage.getItem('userRole')
      const userEmail = localStorage.getItem('userEmail')

      const response = await fetch('/api/customer/loyalty/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId || '',
          'x-user-email': userEmail || '',
          'x-user-role': userRole || ''
        },
        body: JSON.stringify({ rewardId })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Success', 'Reward redeemed successfully!')
        fetchLoyaltyData() // Refresh data
      } else {
        const errorData = await response.json()
        toast.error('Error', errorData.error || 'Failed to redeem reward')
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      toast.error('Error', 'Failed to redeem reward')
    } finally {
      setRedeeming(false)
    }
  }

  if (loading) {
    return (
      <CustomerDashboardLayout currentPage="loyalty" userEmail={userEmail} userName={userName}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
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
            <p style={{ color: '#6b7280' }}>Loading loyalty data...</p>
          </div>
        </div>
      </CustomerDashboardLayout>
    )
  }

  return (
    <CustomerDashboardLayout currentPage="loyalty" userEmail={userEmail} userName={userName}>
      <div style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Loyalty Program
          </h1>
          <p style={{ color: '#6b7280' }}>
            Earn points with every order and redeem for amazing rewards
          </p>
        </div>

        {/* Points Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.25rem' }}>
              {loyaltyData?.availablePoints || 0}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Available Points</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>
              {loyaltyData?.totalPoints || 0}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Earned</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.25rem' }}>
              {loyaltyData?.usedPoints || 0}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Points Redeemed</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: 'white',
            borderRadius: '12px 12px 0 0',
            overflow: 'hidden'
          }}>
            {[
              { key: 'overview' as const, label: 'Overview', icon: '📊' },
              { key: 'history' as const, label: 'Points History', icon: '📋' },
              { key: 'rewards' as const, label: 'Available Rewards', icon: '🎁' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: activeTab === tab.key ? '#f8fafc' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === tab.key ? '600' : '400',
                  color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          minHeight: '400px'
        }}>
          {activeTab === 'overview' && (
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                How to Earn Points
              </h3>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem' }}>🛒</div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>Complete an Order</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Earn 1 point for every ₹10 spent</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem' }}>⭐</div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>Rate & Review</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Get 50 bonus points for rating your order</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.5rem' }}>👥</div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>Refer a Friend</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Earn 500 points when your friend places first order</div>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Quick Stats
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
                  <div style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: '500' }}>Next Reward</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0c4a6e' }}>
                    {loyaltyData?.redeemableRewards?.[0] ? 
                      `${loyaltyData.redeemableRewards[0].pointsRequired - (loyaltyData.availablePoints || 0)} points away` :
                      'No rewards available'
                    }
                  </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                  <div style={{ fontSize: '0.875rem', color: '#166534', fontWeight: '500' }}>Points This Month</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#14532d' }}>
                    {loyaltyData?.pointsHistory?.filter(p => {
                      const pointDate = new Date(p.createdAt)
                      const now = new Date()
                      return pointDate.getMonth() === now.getMonth() && 
                             pointDate.getFullYear() === now.getFullYear() &&
                             p.type === 'EARNED'
                    }).reduce((sum, p) => sum + p.points, 0) || 0}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Points History
              </h3>
              {loyaltyData?.pointsHistory?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                  <p style={{ color: '#6b7280' }}>No points transactions yet</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {loyaltyData?.pointsHistory?.map((transaction) => (
                    <div
                      key={transaction.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #f3f4f6'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          fontSize: '1.25rem',
                          color: transaction.type === 'EARNED' ? '#10b981' : 
                                transaction.type === 'REDEEMED' ? '#f59e0b' : '#ef4444'
                        }}>
                          {transaction.type === 'EARNED' ? '⬆️' : 
                           transaction.type === 'REDEEMED' ? '⬇️' : '⏰'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: '#111827' }}>
                            {transaction.description}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontWeight: 'bold',
                        color: transaction.type === 'EARNED' ? '#10b981' : 
                              transaction.type === 'REDEEMED' ? '#f59e0b' : '#ef4444'
                      }}>
                        {transaction.type === 'EARNED' ? '+' : '-'}{transaction.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                Available Rewards
              </h3>
              {loyaltyData?.redeemableRewards?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
                  <p style={{ color: '#6b7280' }}>No rewards available at the moment</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  {loyaltyData?.redeemableRewards?.map((reward) => (
                    <div
                      key={reward.id}
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '12px',
                        border: '1px solid #f3f4f6'
                      }}
                    >
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: '600', 
                          color: '#111827',
                          marginBottom: '0.5rem'
                        }}>
                          {reward.name}
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: '#6b7280',
                          marginBottom: '0.75rem'
                        }}>
                          {reward.description}
                        </div>
                        <div style={{
                          display: 'inline-block',
                          backgroundColor: '#ddd6fe',
                          color: '#5b21b6',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {reward.category}
                        </div>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          color: '#f59e0b'
                        }}>
                          {reward.pointsRequired} pts
                        </div>
                        <button
                          onClick={() => redeemReward(reward.id)}
                          disabled={redeeming || (loyaltyData?.availablePoints || 0) < reward.pointsRequired}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: (loyaltyData?.availablePoints || 0) >= reward.pointsRequired && !redeeming ? '#3b82f6' : '#9ca3af',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: (loyaltyData?.availablePoints || 0) >= reward.pointsRequired && !redeeming ? 'pointer' : 'not-allowed'
                          }}
                        >
                          {redeeming ? 'Redeeming...' : 
                           (loyaltyData?.availablePoints || 0) >= reward.pointsRequired ? 'Redeem' : 'Insufficient Points'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </CustomerDashboardLayout>
  )
}