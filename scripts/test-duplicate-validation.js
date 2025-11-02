// Test script to verify duplicate validation functionality
// This script can be run after starting the development server

const BASE_URL = 'http://localhost:3000'

async function testDuplicateValidation() {
  console.log('🧪 Testing duplicate email and phone validation...\n')

  // Test 1: Create a user with valid data
  console.log('1️⃣ Creating initial user...')
  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    phone: '9876543210',
    role: 'CUSTOMER'
  }

  try {
    const response1 = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    })
    
    if (response1.ok) {
      console.log('✅ First user created successfully')
    } else {
      const error = await response1.json()
      console.log('❌ First user creation failed:', error.error)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }

  // Test 2: Try to create user with same email
  console.log('\n2️⃣ Testing duplicate email validation...')
  const duplicateEmailUser = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'john.doe@test.com', // Same email
    phone: '8765432109', // Different phone
    role: 'STORE_ADMIN'
  }

  try {
    const response2 = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicateEmailUser)
    })
    
    if (response2.ok) {
      console.log('❌ Duplicate email validation failed - user created unexpectedly')
    } else {
      const error = await response2.json()
      console.log('✅ Duplicate email caught:', error.error)
      console.log('   Field:', error.field)
      console.log('   Type:', error.type)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }

  // Test 3: Try to create user with same phone
  console.log('\n3️⃣ Testing duplicate phone validation...')
  const duplicatePhoneUser = {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@test.com', // Different email
    phone: '9876543210', // Same phone
    role: 'FRANCHISE_ADMIN'
  }

  try {
    const response3 = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicatePhoneUser)
    })
    
    if (response3.ok) {
      console.log('❌ Duplicate phone validation failed - user created unexpectedly')
    } else {
      const error = await response3.json()
      console.log('✅ Duplicate phone caught:', error.error)
      console.log('   Field:', error.field)
      console.log('   Type:', error.type)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }

  // Test 4: Create user with unique data
  console.log('\n4️⃣ Creating user with unique data...')
  const uniqueUser = {
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@test.com',
    phone: '7654321098',
    role: 'CUSTOMER'
  }

  try {
    const response4 = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uniqueUser)
    })
    
    if (response4.ok) {
      console.log('✅ Unique user created successfully')
    } else {
      const error = await response4.json()
      console.log('❌ Unique user creation failed:', error.error)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }

  console.log('\n🎉 Validation testing completed!')
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testDuplicateValidation }
} else if (typeof window !== 'undefined') {
  window.testDuplicateValidation = testDuplicateValidation
}

// Auto-run if in Node.js environment
if (typeof require !== 'undefined' && require.main === module) {
  testDuplicateValidation()
}