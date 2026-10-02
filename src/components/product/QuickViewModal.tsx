'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Check, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';

interface QuickViewModalProps {
  product: any;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t, getBilingualText } = useLanguage();

  const [selectedImage, setSelectedImage] = useState(product.thumbnail || product.images?.[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isLiked = isInWishlist(product._id);
  const productName = getBilingualText(product.name);
  const productDesc = getBilingualText(product.shortDescription || product.description);
  const rawCatName = typeof product.category === 'object' ? product.category?.name : product.category;
  const categoryName = rawCatName ? getBilingualText(rawCatName) : t('nav.shop');

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: productName,
      slug: product.slug,
      sku: product.sku || product.slug.substring(0, 8).toUpperCase(),
      image: selectedImage,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxStock: product.stock,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 z-20"
          aria-label={t('common.close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="p-6 bg-slate-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
          <div className="relative aspect-[3/4] w-full max-w-sm rounded-2xl overflow-hidden shadow-sm mb-4">
            <Image
              src={selectedImage}
              alt={productName}
              fill
              className="object-cover object-center"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-full pb-2">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-14 h-18 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                    selectedImage === img ? 'border-[#0F4C3A]' : 'border-transparent opacity-70'
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-xs font-semibold text-[#0F4C3A] uppercase tracking-wider block mb-1">
              {categoryName}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{productName}</h2>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-slate-900">
                {t('common.rs')} {product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  {t('common.rs')} {product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-6">
              {productDesc}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  {t('shop.size')}: <span className="text-[#0F4C3A] font-bold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz: string) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedSize === sz
                          ? 'border-[#0F4C3A] bg-[#0F4C3A] text-white shadow-sm'
                          : 'border-slate-300 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  {t('shop.color')}: <span className="text-[#0F4C3A] font-bold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c: string) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        selectedColor === c
                          ? 'border-[#0F4C3A] bg-[#E6F4EE] text-[#0F4C3A] font-bold ring-2 ring-[#0F4C3A]/20'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold text-slate-700 uppercase">{t('shop.quantity')}:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-semibold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3.5 rounded-xl text-sm font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                  added ? 'bg-emerald-600' : 'bg-[#0F4C3A] hover:bg-[#0B3B2D]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> {t('systemMessages.addedToCart')}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> {t('shop.addToCart')}
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  toggleWishlist({
                    productId: product._id,
                    name: productName,
                    slug: product.slug,
                    price: product.price,
                    image: product.thumbnail,
                    category: categoryName,
                  })
                }
                className={`p-3.5 rounded-xl border transition-colors ${
                  isLiked ? 'bg-[#9B111E] text-white border-[#9B111E]' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
                aria-label={t('shop.addToWishlist')}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs text-[#0F4C3A] font-semibold hover:underline"
            >
              {t('shop.productDetails')} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
