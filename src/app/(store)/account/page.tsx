'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AccountDashboardPage() {
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
        {t('account.myProfile')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#E6F4EE] border border-[#D0EAE0] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F4C3A] text-white flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t('account.myOrders')}</span>
            <Link href="/account/orders" className="text-sm font-bold text-[#0F4C3A] hover:underline">
              {t('account.orderHistory')} →
            </Link>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#9B111E] text-white flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t('account.wishlist')}</span>
            <span className="text-sm font-bold text-slate-900">{wishlist.length} Items</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold text-slate-800">{t('account.accountSettings')}</h3>
        <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1.5 text-slate-700 border border-slate-200">
          <p><strong>{t('checkout.fullName')}:</strong> {user?.name}</p>
          <p><strong>{t('auth.email')}:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      </div>
    </div>
  );
}
