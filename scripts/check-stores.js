const { PrismaClient } = require('@prisma/client')

async function checkStores() {
  const prisma = new PrismaClient()
  
  try {
    const stores = await prisma.store.findMany({
      include: {
        franchise: true,
        admin: true
      }
    })
    
    console.log('Total stores:', stores.length)
    
    if (stores.length > 0) {
      stores.forEach(store => {
        console.log(`Store: ${store.name} (ID: ${store.id})`)
        console.log(`  Franchise: ${store.franchise.name}`)
        console.log(`  Admin: ${store.admin ? store.admin.email : 'No admin assigned'}`)
        console.log(`  City: ${store.city}, State: ${store.state}`)
        console.log('---')
      })
    } else {
      console.log('No stores found in database')
    }
    
    // Also check users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true
      }
    })
    
    console.log('\nTotal users:', users.length)
    users.forEach(user => {
      console.log(`User: ${user.email} (${user.role}) - Active: ${user.isActive}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkStores()