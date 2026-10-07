'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import { useLanguage } from '@/context/LanguageContext';

interface ProductGridProps {
  products: any[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const { t } = useLanguage();

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 font-sans">
        <p className="text-slate-500 font-medium text-sm">{t('shop.noProductsFound')}</p>
      </div>
    );
  }

  return (
    <div className="w-full font-sans">
      {(title || subtitle) && (
        <div className="mb-8 text-center max-w-2xl mx-auto">
          {title && <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">{title}</h2>}
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>
      )}

      {/* Grid Layout: Desktop 4 col, Tablet 3 col, Mobile 2 col */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id || product._id || product.slug}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
