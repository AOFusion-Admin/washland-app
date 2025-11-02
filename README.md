# Washland PWA - Dry Cleaning & Laundry Franchise Management

A comprehensive Progressive Web Application built with Next.js for managing a dry cleaning and laundry franchise business.

## 🌟 Features

### Customer Features
- **Service Booking**: Browse and book dry cleaning and laundry services
- **Store Locator**: Find nearby franchise locations with address and contact info
- **Subscription Plans**: Monthly subscription plans with discounts
- **Order Tracking**: Real-time tracking of order status
- **Payment Integration**: Secure payments via Stripe
- **User Dashboard**: Manage orders, addresses, and subscriptions

### Admin Features
- **Super Admin Dashboard**: Manage entire franchise network
- **Franchise Management**: Oversee multiple franchise locations
- **Store Management**: Individual store administration
- **Service Management**: Add/edit services and pricing
- **Order Management**: Process and track all orders
- **Analytics**: Business insights and reporting

### Technical Features
- **Progressive Web App (PWA)**: Installable on mobile devices
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Multi-role Authentication**: Customer, Store Admin, Franchise Admin, Super Admin
- **Real-time Updates**: Live order status updates
- **Offline Support**: Works offline with cached data

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe Integration
- **Styling**: Custom CSS with responsive design
- **PWA**: Service Worker for offline functionality

## 📋 Database Schema

The application includes comprehensive models for:
- **Users**: Multi-role user management (Customer, Store Admin, Franchise Admin, Super Admin)
- **Franchises**: Franchise location management
- **Stores**: Individual store information and management
- **Services**: Service catalog with pricing
- **Orders**: Order processing and tracking
- **Subscriptions**: Monthly subscription plans
- **Addresses**: Customer address management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd washland-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/washland_db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
washland-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Utility functions and configurations
│   └── types/                  # TypeScript type definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # PWA icons
└── package.json
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Database Management
- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply migrations

## 🎨 Design System

The app uses a custom design system with:
- **Colors**: Washland blue (#1e40af) as primary color
- **Typography**: Inter font family
- **Components**: Reusable button, card, and form components
- **Responsive**: Mobile-first responsive design

## 🔐 Authentication & Authorization

- **NextAuth.js** for authentication
- **Role-based access control** (RBAC)
- **Protected routes** for admin areas
- **JWT tokens** for session management

## 💳 Payment Integration

- **Stripe** for payment processing
- **Subscription management** for recurring payments
- **Webhook handling** for payment events
- **PCI compliance** through Stripe

## 📱 PWA Features

- **App manifest** for installation
- **Service worker** for offline functionality
- **Push notifications** for order updates
- **App-like experience** on mobile devices

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - Railway
   - AWS/Google Cloud/Azure

3. **Set up production database**
   - PostgreSQL on your cloud provider
   - Update DATABASE_URL in production environment

4. **Configure environment variables**
   - Set all required environment variables in your deployment platform

## 📈 Scalability

The application is designed to scale with:
- **Database optimization** with proper indexing
- **API rate limiting** for protection
- **Caching strategies** for performance
- **Microservices ready** architecture
- **Load balancing** support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ for the Washland franchise network.