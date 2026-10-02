'use client';

import React from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/product/ProductGrid';
import { useLanguage } from '@/context/LanguageContext';

interface ShopPageClientProps {
  products: any[];
  totalCount: number;
  dbCategories: any[];
  selectedCategoryObj: any;
  categorySlug?: string;
  selectedSize?: string;
  selectedColor?: string;
  minPrice?: string;
  maxPrice?: string;
  sort: string;
  searchQuery?: string;
  page: number;
  totalPages: number;
  standardSizes: string[];
  colorOptions: any[];
}

export default function ShopPageClient({
  products,
  totalCount,
  dbCategories,
  selectedCategoryObj,
  categorySlug,
  selectedSize,
  selectedColor,
  minPrice,
  maxPrice,
  sort,
  searchQuery,
  page,
  totalPages,
  standardSizes,
  colorOptions,
}: ShopPageClientProps) {
  const { t, getBilingualText } = useLanguage();

  const titleText = selectedCategoryObj
    ? getBilingualText(selectedCategoryObj.name)
    : searchQuery
    ? `${t('shop.searchProducts')}: "${searchQuery}"`
    : t('shop.allProducts');

  const descText = selectedCategoryObj
    ? getBilingualText(selectedCategoryObj.description)
    : t('shop.subtitle');

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 font-sans">
      {/* Header Breadcrumb */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-2">
            US Garment Store Catalog
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3">
            {titleText}
          </h1>
          <p className="text-sm text-slate-300">
            {descText}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters Column */}
        <aside className="space-y-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-card h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">{t('shop.filter')}</h3>
            {(categorySlug || selectedSize || selectedColor || minPrice || maxPrice || searchQuery) && (
              <Link href="/shop" className="text-xs text-[#9B111E] hover:underline font-semibold">
                {t('shop.clearFilters')}
              </Link>
            )}
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">{t('shop.categories')}</h4>
            <div className="space-y-1.5 text-xs">
              <Link
                href="/shop"
                className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                  !categorySlug ? 'bg-[#E6F4EE] text-[#0F4C3A] font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t('shop.categoryFilterAll')}
              </Link>
              {dbCategories.map((c) => {
                const cName = getBilingualText(c.name);
                return (
                  <Link
                    key={c._id}
                    href={`/shop?category=${c.slug}`}
                    className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                      categorySlug === c.slug ? 'bg-[#E6F4EE] text-[#0F4C3A] font-bold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cName}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sizes Filter */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">{t('shop.size')}</h4>
            <div className="flex flex-wrap gap-1.5">
              {standardSizes.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <Link
                    key={sz}
                    href={`/shop?${new URLSearchParams({
                      ...(categorySlug ? { category: categorySlug } : {}),
                      ...(selectedColor ? { color: selectedColor } : {}),
                      ...(sort ? { sort } : {}),
                      ...(isSelected ? {} : { size: sz }),
                    }).toString()}`}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold border transition-all ${
                      isSelected
                        ? 'border-[#0F4C3A] bg-[#0F4C3A] text-white shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {sz}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Colors Filter */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">{t('shop.color')}</h4>
            <div className="flex flex-wrap gap-1.5">
              {colorOptions.map((c) => {
                const isSelected = selectedColor === c.name;
                return (
                  <Link
                    key={c.name}
                    href={`/shop?${new URLSearchParams({
                      ...(categorySlug ? { category: categorySlug } : {}),
                      ...(selectedSize ? { size: selectedSize } : {}),
                      ...(sort ? { sort } : {}),
                      ...(isSelected ? {} : { color: c.name }),
                    }).toString()}`}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium border transition-all ${
                      isSelected
                        ? 'border-[#0F4C3A] bg-[#E6F4EE] text-[#0F4C3A] font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Product Grid Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-medium">
              {t('shop.showingResults', { count: products.length })} ({totalCount} total)
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">{t('shop.sortBy')}:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { label: t('shop.sortNewest'), val: 'newest' },
                  { label: t('shop.sortPopular'), val: 'featured' },
                  { label: t('shop.sortPriceLowHigh'), val: 'price-low' },
                  { label: t('shop.sortPriceHighLow'), val: 'price-high' },
                ].map((s) => (
                  <Link
                    key={s.val}
                    href={`/shop?${new URLSearchParams({
                      ...(categorySlug ? { category: categorySlug } : {}),
                      ...(selectedSize ? { size: selectedSize } : {}),
                      ...(selectedColor ? { color: selectedColor } : {}),
                      sort: s.val,
                    }).toString()}`}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      sort === s.val
                        ? 'bg-[#0F4C3A] text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid products={products} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/shop?${new URLSearchParams({
                    ...(categorySlug ? { category: categorySlug } : {}),
                    ...(selectedSize ? { size: selectedSize } : {}),
                    ...(selectedColor ? { color: selectedColor } : {}),
                    ...(sort ? { sort } : {}),
                    page: p.toString(),
                  }).toString()}`}
                  className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    page === p
                      ? 'bg-[#0F4C3A] text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
