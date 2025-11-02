const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const prisma = new PrismaClient()

  const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@washlandlaundry.in'
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'ChangeMe123!'
  const firstName = process.env.ADMIN_FIRST_NAME || 'Washland'
  const lastName = process.env.ADMIN_LAST_NAME || 'Admin'
  const role = process.env.ADMIN_ROLE || 'SUPER_ADMIN'

  if (!email || !password) {
    console.error('Please provide email and password as args or via ADMIN_EMAIL/ADMIN_PASSWORD env vars')
    process.exit(1)
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      console.log('User already exists:', existing.email)
      process.exit(0)
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        firstName,
        lastName,
        role,
        isActive: true
      }
    })

    console.log('Created Washland admin:', { id: user.id, email: user.email, role: user.role })
    process.exit(0)
  } catch (err) {
    console.error('Error creating admin:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
