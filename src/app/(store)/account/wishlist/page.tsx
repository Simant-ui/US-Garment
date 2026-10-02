'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { t } = useLanguage();

  if (wishlist.length === 0) {
    return (
      <div className="py-12 text-center space-y-3 font-sans">
        <Heart className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="text-sm font-semibold text-slate-700">{t('account.noWishlist')}</p>
        <Link href="/shop" className="text-xs text-[#0F4C3A] font-bold hover:underline">
          {t('cart.startShopping')} →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
        {t('account.wishlist')} ({wishlist.length})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((item) => (
          <div key={item.productId} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <span className="text-[10px] font-bold text-[#0F4C3A] uppercase">{item.category}</span>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
              <p className="text-xs font-bold text-slate-900">{t('common.rs')} {item.price.toLocaleString()}</p>
            </div>

            <div className="pt-3 flex items-center justify-between gap-2 mt-2 border-t border-slate-100">
              <Link
                href={`/product/${item.slug}`}
                className="flex-1 py-2 bg-[#0F4C3A] text-white rounded-lg text-xs font-bold text-center hover:bg-[#0B3B2D]"
              >
                {t('common.view')}
              </Link>
              <button
                onClick={() => toggleWishlist(item)}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                aria-label={t('common.delete')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
