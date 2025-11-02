const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createSampleOrders() {
  try {
    console.log('Creating sample orders...')
    
    // First, let's find existing stores and users
    const stores = await prisma.store.findMany({
      include: {
        franchise: true
      }
    })
    
    if (stores.length === 0) {
      console.log('No stores found. Please create a store first.')
      return
    }
    
    const users = await prisma.user.findMany({
      where: {
        role: 'CUSTOMER'
      }
    })
    
    // Create some customers if none exist
    let customers = users
    if (users.length === 0) {
      console.log('Creating sample customers...')
      customers = await Promise.all([
        prisma.user.create({
          data: {
            email: 'customer1@example.com',
            password: 'password123',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            phone: '+91 9876543210',
            role: 'CUSTOMER'
          }
        }),
        prisma.user.create({
          data: {
            email: 'customer2@example.com',
            password: 'password123',
            firstName: 'Priya',
            lastName: 'Sharma',
            phone: '+91 9876543211',
            role: 'CUSTOMER'
          }
        }),
        prisma.user.create({
          data: {
            email: 'customer3@example.com',
            password: 'password123',
            firstName: 'Amit',
            lastName: 'Patel',
            phone: '+91 9876543212',
            role: 'CUSTOMER'
          }
        })
      ])
    }
    
    // Create addresses for customers
    console.log('Creating sample addresses...')
    const addresses = await Promise.all(
      customers.slice(0, 3).map((customer, index) => 
        prisma.address.create({
          data: {
            userId: customer.id,
            title: ['Home', 'Office', 'Home'][index],
            street: `House ${index + 1}, Street ${index + 1}, Sector ${index + 1}`,
            city: ['Hyderabad', 'Bangalore', 'Chennai'][index],
            state: ['Telangana', 'Karnataka', 'Tamil Nadu'][index],
            zipCode: `50000${index + 1}`,
            isDefault: true
          }
        })
      )
    )
    
    // Create services if they don't exist
    let services = await prisma.service.findMany()
    if (services.length === 0) {
      console.log('Creating sample services...')
      services = await Promise.all([
        prisma.service.create({
          data: {
            name: 'Shirt Wash & Iron',
            category: 'Regular Wash',
            basePrice: 50.00,
            description: 'Standard shirt washing and ironing service'
          }
        }),
        prisma.service.create({
          data: {
            name: 'Trouser Wash & Iron',
            category: 'Regular Wash',
            basePrice: 60.00,
            description: 'Standard trouser washing and ironing service'
          }
        }),
        prisma.service.create({
          data: {
            name: 'Saree Wash & Iron',
            category: 'Delicate Wash',
            basePrice: 150.00,
            description: 'Gentle saree washing and ironing service'
          }
        }),
        prisma.service.create({
          data: {
            name: 'Kurta Wash & Iron',
            category: 'Ethnic Wear',
            basePrice: 80.00,
            description: 'Traditional kurta washing and ironing service'
          }
        })
      ])
    }
    
    // Create sample orders
    console.log('Creating sample orders...')
    console.log('Available services:', services.map(s => ({ id: s.id, name: s.name })))
    console.log('Available customers:', customers.map(c => ({ id: c.id, name: c.firstName })))
    console.log('Available addresses:', addresses.map(a => ({ id: a.id, title: a.title })))
    
    const sampleOrders = [
      {
        userId: customers[0].id,
        storeId: stores[0].id,
        addressId: addresses[0].id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        totalAmount: 280.00,
        pickupDate: new Date(Date.now() + 86400000), // Tomorrow
        deliveryDate: new Date(Date.now() + 259200000), // 3 days from now
        specialInstructions: 'Handle with care',
        items: [
          { serviceId: services.find(s => s.name.includes('Shirt')).id, quantity: 3, price: 50.00, notes: 'Light starch' },
          { serviceId: services.find(s => s.name.includes('Trouser')).id, quantity: 2, price: 60.00, notes: 'Medium starch' }
        ]
      },
      {
        userId: customers[0].id,
        storeId: stores[0].id,
        addressId: addresses[0].id,
        status: 'IN_PROGRESS',
        paymentStatus: 'PAID',
        totalAmount: 300.00,
        pickupDate: new Date(Date.now() - 86400000), // Yesterday
        deliveryDate: new Date(Date.now() + 86400000), // Tomorrow
        specialInstructions: 'Use gentle detergent',
        items: [
          { serviceId: services.find(s => s.name.includes('Saree')).id, quantity: 2, price: 150.00, notes: 'Very delicate fabric' }
        ]
      },
      {
        userId: customers[0].id,
        storeId: stores[0].id,
        addressId: addresses[0].id,
        status: 'READY_FOR_PICKUP',
        paymentStatus: 'PAID',
        totalAmount: 160.00,
        pickupDate: new Date(Date.now() - 172800000), // 2 days ago
        deliveryDate: new Date(),
        specialInstructions: '',
        items: [
          { serviceId: services.find(s => s.name.includes('Kurta')).id, quantity: 2, price: 80.00, notes: 'Regular starch' }
        ]
      }
    ]
    
    for (const orderData of sampleOrders) {
      const { items, ...orderInfo } = orderData
      
      // Generate unique order number
      const orderNumber = `WL-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      
      const order = await prisma.order.create({
        data: {
          ...orderInfo,
          orderNumber,
          items: {
            create: items
          }
        },
        include: {
          items: {
            include: {
              service: true
            }
          },
          user: true,
          store: true,
          address: true
        }
      })
      
      console.log(`Created order: ${order.orderNumber}`)
    }
    
    console.log('Sample orders created successfully!')
    
  } catch (error) {
    console.error('Error creating sample orders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleOrders()