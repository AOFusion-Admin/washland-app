'use client';

import { useState, useEffect } from 'react';

interface HeroImage {
  id?: string;
  imageUrl: string;
  altText: string;
  position: string;
  displayOrder?: number;
  isActive?: boolean;
}

interface HeroOffer {
  id?: string;
  title: string;
  description?: string;
  discountText?: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
  expiresAt?: string;
}

interface HeroContent {
  id?: string;
  title: string;
  subtitle: string;
  description?: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  images: HeroImage[];
  offers: HeroOffer[];
}

export function useHeroContent() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeroContent() {
      try {
        const response = await fetch('/api/hero-content');
        if (!response.ok) {
          throw new Error('Failed to fetch hero content');
        }
        const data = await response.json();
        setHeroContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchHeroContent();
  }, []);

  return { heroContent, loading, error };
}