const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createStoreAdmin() {
  try {
    console.log('Creating test store admin...')

    // First, let's check if we have any stores
    const stores = await prisma.store.findMany({
      include: { franchise: true },
      take: 1
    })

    if (stores.length === 0) {
      console.log('No stores found. Please create a franchise and store first.')
      return
    }

    const store = stores[0]
    console.log(`Found store: ${store.name} in ${store.city}`)

    // Create store admin
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const storeAdmin = await prisma.user.create({
      data: {
        email: 'store.admin@washland.com',
        password: hashedPassword,
        firstName: 'Store',
        lastName: 'Admin',
        phone: '9876543210',
        role: 'STORE_ADMIN',
        isActive: true
      }
    })

    // Assign admin to store
    await prisma.store.update({
      where: { id: store.id },
      data: { adminId: storeAdmin.id }
    })

    console.log(`✅ Store admin created successfully!`)
    console.log(`   Email: store.admin@washland.com`)
    console.log(`   Password: admin123`)
    console.log(`   Store: ${store.name}`)
    console.log(`   Store ID: ${store.id}`)
    console.log(`   User ID: ${storeAdmin.id}`)

  } catch (error) {
    console.error('❌ Error creating store admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createStoreAdmin()