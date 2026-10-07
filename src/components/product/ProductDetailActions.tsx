'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Check, MessageCircle, Ruler } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { SITE_CONFIG } from '@/lib/constants';

export default function ProductDetailActions({ product }: { product: any }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t, getBilingualText } = useLanguage();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const productId = product.id || product._id || product.slug;
  const isLiked = isInWishlist(productId);
  const productName = getBilingualText(product.name);

  // Variant inventory lookup
  const currentVariant = product.variants?.find(
    (v: any) => v.size === selectedSize && v.color === selectedColor
  );
  const currentStock = currentVariant ? currentVariant.stock : product.stock;

  const handleAddToCart = () => {
    addToCart({
      productId: productId,
      name: productName,
      slug: product.slug,
      sku: currentVariant?.sku || product.sku,
      image: currentVariant?.image || product.thumbnail,
      price: currentVariant?.price || product.price,
      compareAtPrice: product.compareAtPrice,
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxStock: currentStock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Size Selector with Size Guide button */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-700 uppercase">
              {t('shop.size')}: <span className="text-[#0F4C3A] font-bold">{selectedSize}</span>
            </label>
            <button
              type="button"
              onClick={() => setShowSizeGuide(true)}
              className="text-xs text-[#0F4C3A] font-semibold flex items-center gap-1 hover:underline"
            >
              <Ruler className="w-3.5 h-3.5" /> {t('customTailoring.measurements')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((sz: string) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedSize === sz
                    ? 'border-[#0F4C3A] bg-[#0F4C3A] text-white shadow-md'
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
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
            {t('shop.color')}: <span className="text-[#0F4C3A] font-bold">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c: string) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedColor === c
                    ? 'border-[#0F4C3A] bg-[#E6F4EE] text-[#0F4C3A] font-bold ring-2 ring-[#0F4C3A]/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Stock Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700 uppercase">{t('shop.quantity')}:</span>
          <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold"
            >
              -
            </button>
            <span className="px-4 py-1.5 text-sm font-bold text-slate-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold"
            >
              +
            </button>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full ${currentStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
          {currentStock > 0 ? `${t('shop.inStock')} (${currentStock})` : t('shop.outOfStock')}
        </span>
      </div>

      {/* Main Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={currentStock <= 0}
            className={`flex-1 py-4 rounded-2xl text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
              added ? 'bg-emerald-600' : currentStock > 0 ? 'bg-[#0F4C3A] hover:bg-[#0B3B2D]' : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" /> {t('systemMessages.addedToCart')}
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" /> {t('shop.addToCart')}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              toggleWishlist({
                productId: productId,
                name: productName,
                slug: product.slug,
                price: product.price,
                image: product.thumbnail,
                category: typeof product.category === 'object' ? getBilingualText(product.category?.name) : 'Garments',
              })
            }
            className={`p-4 rounded-2xl border transition-colors ${
              isLiked ? 'bg-[#9B111E] text-white border-[#9B111E]' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            aria-label={t('shop.addToWishlist')}
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={currentStock <= 0}
          className="w-full py-4 rounded-2xl text-sm font-bold bg-[#D4AF37] hover:bg-[#C09F2F] text-[#10233F] shadow-md transition-all"
        >
          {t('shop.buyNow')}
        </button>

        {/* WhatsApp Inquiry Button */}
        <a
          href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Namaste!%20I%20want%20to%20inquire%20about%20${encodeURIComponent(productName)}%20(SKU:%20${product.sku})`}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3.5 rounded-2xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <MessageCircle className="w-4 h-4" /> {t('topBar.whatsappUs')}
        </a>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)}></div>
          <div className="relative bg-white max-w-lg w-full p-6 rounded-3xl shadow-2xl z-10 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">{t('customTailoring.measurements')} (Nepal Standard)</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-2 text-left border">{t('shop.size')}</th>
                    <th className="p-2 text-left border">{t('customTailoring.chest')}</th>
                    <th className="p-2 text-left border">{t('customTailoring.waist')}</th>
                    <th className="p-2 text-left border">{t('customTailoring.dressLength')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600">
                  <tr><td className="p-2 font-bold border">S</td><td className="p-2 border">36 - 38</td><td className="p-2 border">30 - 32</td><td className="p-2 border">27</td></tr>
                  <tr><td className="p-2 font-bold border">M</td><td className="p-2 border">38 - 40</td><td className="p-2 border">32 - 34</td><td className="p-2 border">28</td></tr>
                  <tr><td className="p-2 font-bold border">L</td><td className="p-2 border">40 - 42</td><td className="p-2 border">34 - 36</td><td className="p-2 border">29</td></tr>
                  <tr><td className="p-2 font-bold border">XL</td><td className="p-2 border">42 - 44</td><td className="p-2 border">36 - 38</td><td className="p-2 border">30</td></tr>
                  <tr><td className="p-2 font-bold border">2XL</td><td className="p-2 border">44 - 46</td><td className="p-2 border">38 - 40</td><td className="p-2 border">31</td></tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setShowSizeGuide(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
