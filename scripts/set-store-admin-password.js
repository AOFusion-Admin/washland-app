const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function setStoreAdminPassword() {
  const prisma = new PrismaClient()
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'washland.drycleaners@gmail.com' },
      select: { email: true, password: true, id: true }
    })
    
    if (!user) {
      console.log('Store admin user not found')
      return
    }
    
    console.log('User has password set:', !!user.password)
    
    if (!user.password) {
      // Set a default password
      const defaultPassword = 'admin123'
      const hashedPassword = await bcrypt.hash(defaultPassword, 10)
      
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
      
      console.log(`Password set for ${user.email}. Default password: ${defaultPassword}`)
    } else {
      console.log('User already has a password set')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setStoreAdminPassword()