'use client';

import React from 'react';
import ProductGrid from '@/components/product/ProductGrid';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryCollectionClientProps {
  titleKey?: string;
  fallbackTitle: any;
  subtitleKey?: string;
  fallbackSubtitle?: string;
  products: any[];
}

export default function CategoryCollectionClient({
  titleKey,
  fallbackTitle,
  subtitleKey,
  fallbackSubtitle,
  products,
}: CategoryCollectionClientProps) {
  const { t, getBilingualText } = useLanguage();

  const title = titleKey ? t(titleKey) : getBilingualText(fallbackTitle);
  const subtitle = subtitleKey ? t(subtitleKey) : fallbackSubtitle ? t(fallbackSubtitle) : t('shop.subtitle');

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 font-sans">
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-2">
          US Garment Collection
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">{title}</h1>
        <p className="text-sm text-slate-300">{subtitle}</p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
