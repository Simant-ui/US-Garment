'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';

export interface ProductCardProps {
  product: {
    id?: string;
    _id?: string;
    name: any;
    slug: string;
    price: number;
    compareAtPrice?: number;
    discount?: number;
    thumbnail: string;
    images: string[];
    category?: { name: any; slug: string } | any;
    sizes: string[];
    colors: string[];
    stock: number;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    isOnSale?: boolean;
  };
  onQuickView?: (product: any) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t, getBilingualText, language } = useLanguage();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Standard');
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const productId = product.id || product._id || product.slug;
  const isLiked = isInWishlist(productId);
  const secondImage = product.images?.[1] || product.thumbnail;

  const rawCatName = typeof product.category === 'object' ? product.category?.name : product.category;
  const categoryName = rawCatName ? getBilingualText(rawCatName) : t('nav.shop');
  const productName = getBilingualText(product.name);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: productId,
      name: productName,
      slug: product.slug,
      sku: product.slug.substring(0, 8).toUpperCase(),
      image: product.thumbnail,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      maxStock: product.stock,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image & Badges Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered ? secondImage : product.thumbnail}
            alt={productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discount && product.discount > 0 ? (
            <span className="bg-[#9B111E] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
              -{product.discount}% OFF
            </span>
          ) : null}
          {product.isNewArrival && (
            <span className="bg-[#0F4C3A] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm">
              {language === 'ne' ? 'नयाँ' : 'NEW'}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#D4AF37] text-[#10233F] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm">
              {language === 'ne' ? 'सर्वाधिक बिक्री' : 'BEST SELLER'}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({
              productId: productId,
              name: productName,
              slug: product.slug,
              price: product.price,
              image: product.thumbnail,
              category: categoryName,
            });
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-all z-10 ${
            isLiked
              ? 'bg-[#9B111E] text-white'
              : 'bg-white/90 text-slate-700 hover:text-[#9B111E] hover:bg-white'
          }`}
          aria-label={t('shop.addToWishlist')}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 text-slate-800 text-xs font-semibold px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 hover:bg-[#0F4C3A] hover:text-white"
          >
            <Eye className="w-3.5 h-3.5" /> {t('shop.quickView')}
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <span className="text-[11px] font-semibold text-[#0F4C3A] uppercase tracking-wider block mb-1">
            {categoryName}
          </span>

          <Link href={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-[#0F4C3A] transition-colors leading-snug mb-2">
              {productName}
            </h3>
          </Link>

          {/* Size & Color Quick Selectors */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.sizes.slice(0, 4).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border transition-colors ${
                    selectedSize === sz
                      ? 'border-[#0F4C3A] bg-[#E6F4EE] text-[#0F4C3A] font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">
                {t('common.rs')} {product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {t('common.rs')} {product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium block ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {product.stock > 0 ? t('shop.inStock') : t('shop.outOfStock')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl text-white transition-all flex items-center justify-center ${
              addedAnimation
                ? 'bg-emerald-600'
                : product.stock > 0
                ? 'bg-[#0F4C3A] hover:bg-[#0B3B2D] shadow-sm hover:shadow-md'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
            aria-label={t('shop.addToCart')}
          >
            {addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
