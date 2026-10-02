'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductGrid from '@/components/product/ProductGrid';
import ProductDetailActions from '@/components/product/ProductDetailActions';
import { useLanguage } from '@/context/LanguageContext';

interface ProductDetailPageClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailPageClient({
  product,
  relatedProducts,
}: ProductDetailPageClientProps) {
  const { t, getBilingualText } = useLanguage();

  const productName = getBilingualText(product.name);
  const shortDesc = getBilingualText(product.shortDescription || product.description);
  const fullDesc = getBilingualText(product.description);
  const rawCatName = typeof product.category === 'object' ? product.category?.name : product.category;
  const categoryName = rawCatName ? getBilingualText(rawCatName) : t('nav.shop');

  return (
    <div className="container mx-auto px-4 py-10 space-y-12 font-sans">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0F4C3A]">{t('nav.home')}</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#0F4C3A]">{t('nav.shop')}</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{productName}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-card">
        {/* Left: Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
            <Image
              src={product.thumbnail || product.images?.[0]}
              alt={productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200">
                  <Image src={img} alt={`${productName} gallery ${index}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions & Details */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-[#0F4C3A] uppercase tracking-widest block mb-1">
              {categoryName} • SKU: {product.sku}
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-3">
              {productName}
            </h1>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-slate-900">
                {t('common.rs')} {product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-base text-slate-400 line-through">
                  {t('common.rs')} {product.compareAtPrice.toLocaleString()}
                </span>
              )}
              {product.discount && product.discount > 0 ? (
                <span className="bg-[#9B111E] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  -{product.discount}% OFF
                </span>
              ) : null}
            </div>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-6">
              {shortDesc}
            </p>
          </div>

          {/* Client Interactive Selectors & Buttons */}
          <ProductDetailActions product={product} />

          {/* Quick Specifications */}
          <div className="pt-6 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            {product.material && <p><strong>{t('customTailoring.fabricPreference')}:</strong> {product.material}</p>}
            {product.careInstructions && <p><strong>Care Instructions:</strong> {product.careInstructions}</p>}
            <p><strong>{t('home.feature4Title')}:</strong> {t('footer.developedWith')}</p>
            <p><strong>{t('cart.shipping')}:</strong> {t('cart.freeShippingTag')}</p>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-lg font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
          {t('shop.description')} & {t('shop.productDetails')}
        </h3>
        <div className="text-sm text-slate-700 leading-relaxed space-y-4">
          <p>{fullDesc}</p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-2xl font-serif font-bold text-slate-900">{t('shop.relatedProducts')}</h3>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
