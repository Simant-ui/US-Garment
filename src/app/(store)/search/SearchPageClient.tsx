'use client';

import React from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/product/ProductGrid';
import { useLanguage } from '@/context/LanguageContext';

interface SearchPageClientProps {
  queryText: string;
  products: any[];
  matchingCategories: any[];
}

export default function SearchPageClient({
  queryText,
  products,
  matchingCategories,
}: SearchPageClientProps) {
  const { t, getBilingualText } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 font-sans">
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12">
        <h1 className="text-2xl md:text-4xl font-serif font-bold mb-2">
          {queryText ? `${t('shop.searchProducts')}: "${queryText}"` : t('shop.searchProducts')}
        </h1>
        <p className="text-xs md:text-sm text-slate-300">
          {t('shop.showingResults', { count: products.length })}
        </p>
      </div>

      {matchingCategories.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('shop.categories')}</h3>
          <div className="flex flex-wrap gap-2">
            {matchingCategories.map((c) => (
              <Link
                key={c._id}
                href={`/category/${c.slug}`}
                className="px-4 py-2 bg-[#E6F4EE] text-[#0F4C3A] font-bold rounded-xl text-xs hover:bg-[#D4EBE1] transition-colors"
              >
                {getBilingualText(c.name)}
              </Link>
            ))}
          </div>
        </div>
      )}

      <ProductGrid products={products} />
    </div>
  );
}
