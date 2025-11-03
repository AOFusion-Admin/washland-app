const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSampleRiders() {
  try {
    console.log('Creating sample riders...')
    
    const defaultPassword = await bcrypt.hash('rider123', 10)
    
    const riders = [
      {
        email: 'rider1@washlandlaundry.in',
        firstName: 'Ravi',
        lastName: 'Kumar',
        phone: '+91 9876543220',
        role: 'RIDER'
      },
      {
        email: 'rider2@washlandlaundry.in',
        firstName: 'Suresh',
        lastName: 'Reddy',
        phone: '+91 9876543221',
        role: 'RIDER'
      },
      {
        email: 'rider3@washlandlaundry.in',
        firstName: 'Mahesh',
        lastName: 'Singh',
        phone: '+91 9876543222',
        role: 'RIDER'
      }
    ]
    
    for (const riderData of riders) {
      // Check if rider already exists
      const existingRider = await prisma.user.findUnique({
        where: { email: riderData.email }
      })
      
      if (!existingRider) {
        const rider = await prisma.user.create({
          data: {
            ...riderData,
            password: defaultPassword,
            isActive: true
          }
        })
        console.log(`Created rider: ${rider.firstName} ${rider.lastName} (${rider.email})`)
      } else {
        console.log(`Rider already exists: ${riderData.email}`)
      }
    }
    
    console.log('Sample riders created successfully!')
    console.log('Default password for all riders: rider123')
    
  } catch (error) {
    console.error('Error creating sample riders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleRiders()