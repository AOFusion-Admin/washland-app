'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroImage {
  imageUrl: string;
  altText: string;
  position: string;
}

interface HeroOffer {
  title: string;
  description?: string;
  discountText?: string;
  imageUrl?: string;
  linkUrl?: string;
  expiresAt?: string;
}

interface HeroContentForm {
  title: string;
  subtitle: string;
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  images: HeroImage[];
  offers: HeroOffer[];
}

export default function HeroContentManager() {
  const [formData, setFormData] = useState<HeroContentForm>({
    title: "Premium Dry Cleaning &",
    subtitle: "Laundry Services",
    description: "Experience the convenience of professional cleaning with our premium dry cleaning and laundry services. From everyday garments to special occasion wear, we handle your clothes with expert care.",
    primaryBtnText: "Book Service Now",
    primaryBtnLink: "/book-service",
    secondaryBtnText: "Find Stores",
    secondaryBtnLink: "/locations",
    images: [
      {
        imageUrl: "/hero-laundry-1.svg",
        altText: "Professional Laundry Service",
        position: "right"
      }
    ],
    offers: [
      {
        title: "50% OFF First Order",
        description: "New Customer Special",
        discountText: "50% OFF",
        imageUrl: "/offer-first-order.svg"
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/hero-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Hero content updated successfully!');
      } else {
        setMessage('Failed to update hero content');
      }
    } catch (error) {
      setMessage('Error updating hero content');
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { imageUrl: '', altText: '', position: 'right' }]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, field: keyof HeroImage, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const addOffer = () => {
    setFormData(prev => ({
      ...prev,
      offers: [...prev.offers, { title: '', description: '', discountText: '' }]
    }));
  };

  const removeOffer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      offers: prev.offers.filter((_, i) => i !== index)
    }));
  };

  const updateOffer = (index: number, field: keyof HeroOffer, value: string) => {
    setFormData(prev => ({
      ...prev,
      offers: prev.offers.map((offer, i) => 
        i === index ? { ...offer, [field]: value } : offer
      )
    }));
  };

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Hero Content Manager
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Basic Content */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Basic Content</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Primary Button Text</label>
              <input
                type="text"
                value={formData.primaryBtnText}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryBtnText: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Primary Button Link</label>
              <input
                type="text"
                value={formData.primaryBtnLink}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryBtnLink: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Hero Images</h2>
            <button
              type="button"
              onClick={addImage}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Add Image
            </button>
          </div>

          {formData.images.map((image, index) => (
            <div key={index} style={{ 
              padding: '1rem', 
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Image URL</label>
                  <input
                    type="text"
                    value={image.imageUrl}
                    onChange={(e) => updateImage(index, 'imageUrl', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Alt Text</label>
                  <input
                    type="text"
                    value={image.altText}
                    onChange={(e) => updateImage(index, 'altText', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Position</label>
                  <select
                    value={image.position}
                    onChange={(e) => updateImage(index, 'position', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="center">Center</option>
                    <option value="background">Background</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Offers Section */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Special Offers</h2>
            <button
              type="button"
              onClick={addOffer}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Add Offer
            </button>
          </div>

          {formData.offers.map((offer, index) => (
            <div key={index} style={{ 
              padding: '1rem', 
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
                  <input
                    type="text"
                    value={offer.title}
                    onChange={(e) => updateOffer(index, 'title', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                  <input
                    type="text"
                    value={offer.description || ''}
                    onChange={(e) => updateOffer(index, 'description', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Discount Text</label>
                  <input
                    type="text"
                    value={offer.discountText || ''}
                    onChange={(e) => updateOffer(index, 'discountText', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeOffer(index)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Image URL</label>
                  <input
                    type="text"
                    value={offer.imageUrl || ''}
                    onChange={(e) => updateOffer(index, 'imageUrl', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Link URL</label>
                  <input
                    type="text"
                    value={offer.linkUrl || ''}
                    onChange={(e) => updateOffer(index, 'linkUrl', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Expires At</label>
                  <input
                    type="date"
                    value={offer.expiresAt || ''}
                    onChange={(e) => updateOffer(index, 'expiresAt', e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#1e40af',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Updating...' : 'Update Hero Content'}
        </button>

        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '0.375rem',
            backgroundColor: message.includes('successfully') ? '#dcfce7' : '#fef2f2',
            color: message.includes('successfully') ? '#166534' : '#dc2626',
            border: `1px solid ${message.includes('successfully') ? '#bbf7d0' : '#fecaca'}`
          }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}