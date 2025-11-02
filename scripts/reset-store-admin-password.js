const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function resetStoreAdminPassword() {
  const prisma = new PrismaClient()
  
  try {
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    const user = await prisma.user.update({
      where: { email: 'washland.drycleaners@gmail.com' },
      data: { password: hashedPassword }
    })
    
    console.log(`Password reset for ${user.email}`)
    console.log(`New password: ${newPassword}`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetStoreAdminPassword()