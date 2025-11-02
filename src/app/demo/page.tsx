import Link from 'next/link';

export default function DemoPage() {
  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Admin Demo - Hero Content Management
      </h1>
      
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        marginBottom: '2rem',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          🎯 Configurable Hero Section Features
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e40af' }}>
              ✨ Content Management
            </h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li><strong>Dynamic Headlines:</strong> Customize title and subtitle</li>
              <li><strong>Rich Descriptions:</strong> Update marketing copy</li>
              <li><strong>CTA Buttons:</strong> Configure text and links</li>
              <li><strong>Trust Indicators:</strong> Show stats and guarantees</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#10b981' }}>
              🖼️ Visual Elements
            </h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li><strong>Hero Images:</strong> Upload and position illustrations</li>
              <li><strong>Offer Banners:</strong> Add promotional images</li>
              <li><strong>Animation Effects:</strong> Layered image positioning</li>
              <li><strong>Responsive Design:</strong> Optimized for all devices</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        marginBottom: '2rem',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          🎨 Current Implementation
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Similar to Fabrico.in Design:
            </h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              <li>Split-screen layout with content on left, visuals on right</li>
              <li>Prominent offer banners with discount highlights</li>
              <li>Professional service illustrations</li>
              <li>Trust indicators and service guarantees</li>
              <li>Clear call-to-action buttons</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Admin Configurable:
            </h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>Hero content via database (HeroContent model)</li>
              <li>Multiple images with positioning control</li>
              <li>Offer management with expiration dates</li>
              <li>Real-time content updates</li>
              <li>API endpoints for content management</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#eff6ff', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        marginBottom: '2rem',
        border: '1px solid #dbeafe'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1e40af' }}>
          🚀 Try the Hero Content Manager
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          The hero content manager allows administrators to update the homepage hero section in real-time. 
          You can modify text, add images, create promotional offers, and control the layout - all through a user-friendly interface.
        </p>
        
        <Link 
          href="/admin/hero-content"
          style={{
            backgroundColor: '#1e40af',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1.125rem',
            fontWeight: '600',
            display: 'inline-block'
          }}
        >
          Open Hero Content Manager →
        </Link>
      </div>

      <div style={{ 
        backgroundColor: '#f0fdf4', 
        padding: '2rem', 
        borderRadius: '0.5rem',
        border: '1px solid #bbf7d0'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#166534' }}>
          📁 Assets Included
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Sample Illustrations:
            </h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li><code>/hero-laundry-1.svg</code> - Animated washing machine</li>
              <li><code>/hero-delivery-1.svg</code> - Delivery van with motion</li>
              <li><code>/offer-first-order.svg</code> - 50% off offer banner</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Database Models:
            </h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li><code>HeroContent</code> - Main content and settings</li>
              <li><code>HeroImage</code> - Image assets with positioning</li>
              <li><code>HeroOffer</code> - Promotional offers and banners</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link 
          href="/"
          style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '1rem'
          }}
        >
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}