const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testStoreLoginComponents() {
  console.log('🧪 Testing store login components...\n')

  try {
    // Test 1: Database connection
    console.log('1️⃣ Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Test 2: Check if stores exist
    console.log('\n2️⃣ Checking stores...')
    const stores = await prisma.store.findMany({
      include: { franchise: true },
      take: 3
    })
    console.log(`✅ Found ${stores.length} stores:`)
    stores.forEach(store => {
      console.log(`   - ${store.name} (ID: ${store.id}) in ${store.city}, ${store.state}`)
    })

    // Test 3: Check if users exist
    console.log('\n3️⃣ Checking users...')
    const users = await prisma.user.findMany({
      where: {
        role: { in: ['STORE_ADMIN', 'FRANCHISE_ADMIN', 'SUPER_ADMIN'] }
      },
      take: 3
    })
    console.log(`✅ Found ${users.length} admin users:`)
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - Active: ${user.isActive}`)
    })

    // Test 4: Test a specific store admin lookup
    if (stores.length > 0) {
      console.log('\n4️⃣ Testing store admin assignment...')
      const storeWithAdmin = await prisma.store.findFirst({
        where: { adminId: { not: null } },
        include: { 
          admin: true,
          franchise: true 
        }
      })
      
      if (storeWithAdmin) {
        console.log(`✅ Found store with admin: ${storeWithAdmin.name}`)
        console.log(`   Admin: ${storeWithAdmin.admin?.firstName} ${storeWithAdmin.admin?.lastName}`)
        console.log(`   Email: ${storeWithAdmin.admin?.email}`)
      } else {
        console.log('⚠️  No stores have assigned admins')
      }
    }

    // Test 5: Test bcrypt (if a user exists)
    if (users.length > 0) {
      console.log('\n5️⃣ Testing password verification...')
      const bcrypt = require('bcryptjs')
      const userWithPassword = users.find(u => u.password && u.password.length > 0)
      
      if (userWithPassword) {
        console.log(`✅ Found user with password: ${userWithPassword.email}`)
        console.log(`   Password hash length: ${userWithPassword.password.length}`)
        
        // Test with a common test password
        const testPassword = 'admin123'
        try {
          const isValid = await bcrypt.compare(testPassword, userWithPassword.password)
          console.log(`   Test password '${testPassword}': ${isValid ? '✅ Valid' : '❌ Invalid'}`)
        } catch (bcryptError) {
          console.log(`   ❌ Bcrypt error: ${bcryptError.message}`)
        }
      } else {
        console.log('⚠️  No users have passwords set')
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
    console.log('\n🏁 Test completed')
  }
}

testStoreLoginComponents()