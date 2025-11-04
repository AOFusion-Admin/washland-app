import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import { ToastProvider } from '@/components/ToastProvider'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Washland - Premium Dry Cleaning & Laundry Services | Professional Cleaning',
  description: 'Experience premium dry cleaning and laundry services with convenient pickup & delivery. Join thousands of satisfied customers across our franchise locations. Same-day service available.',
  keywords: 'dry cleaning, laundry service, pickup delivery, professional cleaning, alterations, shoe cleaning, franchise locations, same day service',
  authors: [{ name: 'Washland' }],
  creator: 'Washland',
  publisher: 'Washland',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://washlandlaundry.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Washland - Premium Dry Cleaning & Laundry Services',
    description: 'Professional dry cleaning and laundry services with convenient pickup & delivery. Same-day service available.',
    url: 'https://washlandlaundry.in',
    siteName: 'Washland',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Washland - Premium Dry Cleaning Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Washland - Premium Dry Cleaning & Laundry Services',
    description: 'Professional dry cleaning and laundry services with convenient pickup & delivery.',
    images: ['/logo.png'],
    creator: '@washland',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Washland" />
        <meta name="application-name" content="Washland" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AuthProvider>
            <ToastProvider>
              <Header />
              {children}
            </ToastProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}