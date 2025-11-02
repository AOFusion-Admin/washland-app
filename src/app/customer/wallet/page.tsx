"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ToastProvider'
import CustomerDashboardLayout from '@/components/CustomerDashboardLayout'

interface WalletData {
  balance: number
  transactions: WalletTransaction[]
  pendingRefunds: number
  totalSpent: number
}

interface WalletTransaction {
  id: string
  type: 'CREDIT' | 'DEBIT' | 'REFUND'
  amount: number
  description: string
  orderId?: string
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
  createdAt: string
}

export default function CustomerWalletPage() {
  const router = useRouter()
  const toast = useToast()
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [addMoneyAmount, setAddMoneyAmount] = useState('')
  const [addingMoney, setAddingMoney] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || ''
    const name = localStorage.getItem('userName') || 'Customer'
    setUserEmail(email)
    setUserName(name)
    
    fetchWalletData()
  }, [])

  const fetchWalletData = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const userRole = localStorage.getItem('userRole')
      const userEmail = localStorage.getItem('userEmail')

      if (!userId || userRole !== 'CUSTOMER') {
        router.push('/auth/signin')
        return
      }

      const response = await fetch('/api/customer/wallet', {
        headers: {
          'x-user-id': userId,
          'x-user-email': userEmail || '',
          'x-user-role': userRole
        }
      })

      if (response.ok) {
        const data = await response.json()
        setWalletData(data.wallet)
      } else {
        toast.error('Error', 'Failed to fetch wallet data')
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error)
      toast.error('Error', 'Failed to fetch wallet data')
    } finally {
      setLoading(false)
    }
  }

  const addMoney = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const amount = parseFloat(addMoneyAmount)
    
    if (!amount || amount <= 0) {
      toast.error('Error', 'Please enter a valid amount')
      return
    }

    if (amount < 10) {
      toast.error('Error', 'Minimum amount is ₹10')
      return
    }

    if (amount > 10000) {
      toast.error('Error', 'Maximum amount is ₹10,000')
      return
    }

    setAddingMoney(true)

    try {
      const userId = localStorage.getItem('userId')
      const userRole = localStorage.getItem('userRole')
      const userEmail = localStorage.getItem('userEmail')

      const response = await fetch('/api/customer/wallet/add-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId || '',
          'x-user-email': userEmail || '',
          'x-user-role': userRole || ''
        },
        body: JSON.stringify({ amount })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Success', 'Money added to wallet successfully!')
        setAddMoneyAmount('')
        fetchWalletData() // Refresh data
      } else {
        const errorData = await response.json()
        toast.error('Error', errorData.error || 'Failed to add money')
      }
    } catch (error) {
      console.error('Error adding money:', error)
      toast.error('Error', 'Failed to add money')
    } finally {
      setAddingMoney(false)
    }
  }

  if (loading) {
    return (
      <CustomerDashboardLayout currentPage="wallet" userEmail={userEmail} userName={userName}>
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
            <p style={{ color: '#6b7280' }}>Loading wallet...</p>
          </div>
        </div>
      </CustomerDashboardLayout>
    )
  }

  return (
    <CustomerDashboardLayout currentPage="wallet" userEmail={userEmail} userName={userName}>
      <div style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            My Wallet
          </h1>
          <p style={{ color: '#6b7280' }}>
            Manage your wallet balance and view transaction history
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {/* Wallet Balance & Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            {/* Balance Display */}
            <div style={{
              backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '2rem',
              borderRadius: '12px',
              color: 'white',
              marginBottom: '2rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                Available Balance
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ₹{walletData?.balance || 0}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Add Money Form */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Add Money
              </h3>
              
              <form onSubmit={addMoney}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={addMoneyAmount}
                    onChange={(e) => setAddMoneyAmount(e.target.value)}
                    placeholder="Enter amount (min ₹10)"
                    min="10"
                    max="10000"
                    step="1"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {[100, 200, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setAddMoneyAmount(amount.toString())}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={addingMoney}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: addingMoney ? '#9ca3af' : '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: addingMoney ? 'not-allowed' : 'pointer'
                  }}
                >
                  {addingMoney ? 'Processing...' : 'Add Money'}
                </button>
              </form>
            </div>

            {/* Quick Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #f3f4f6'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>
                  ₹{walletData?.pendingRefunds || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Pending Refunds</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                  ₹{walletData?.totalSpent || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total Spent</div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              Recent Transactions
            </h3>

            {walletData?.transactions?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                <p style={{ color: '#6b7280' }}>No transactions yet</p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gap: '0.75rem',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {walletData?.transactions?.map((transaction) => (
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
                        color: transaction.type === 'CREDIT' ? '#10b981' : 
                              transaction.type === 'REFUND' ? '#f59e0b' : '#ef4444'
                      }}>
                        {transaction.type === 'CREDIT' ? '⬆️' : 
                         transaction.type === 'REFUND' ? '↩️' : '⬇️'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#111827', fontSize: '0.875rem' }}>
                          {transaction.description}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {new Date(transaction.createdAt).toLocaleDateString()} • 
                          <span style={{
                            color: transaction.status === 'COMPLETED' ? '#10b981' :
                                  transaction.status === 'PENDING' ? '#f59e0b' : '#ef4444',
                            marginLeft: '0.25rem'
                          }}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      fontWeight: 'bold',
                      color: transaction.type === 'DEBIT' ? '#ef4444' : '#10b981'
                    }}>
                      {transaction.type === 'DEBIT' ? '-' : '+'}₹{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wallet Info */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          marginTop: '2rem'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Wallet Information
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem' }}>💰</div>
              <div>
                <div style={{ fontWeight: '500', color: '#111827' }}>Instant Payments</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Use wallet balance for faster checkout</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem' }}>🔄</div>
              <div>
                <div style={{ fontWeight: '500', color: '#111827' }}>Auto Refunds</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Cancelled order amounts are automatically refunded to wallet</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#fef7cd', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem' }}>🎁</div>
              <div>
                <div style={{ fontWeight: '500', color: '#111827' }}>Cashback Rewards</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Earn cashback on orders and get it directly in your wallet</div>
              </div>
            </div>
          </div>
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