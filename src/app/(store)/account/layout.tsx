'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const accountLinks = [
    { name: t('account.myProfile'), href: '/account', icon: User },
    { name: t('account.myOrders'), href: '/account/orders', icon: Package },
    { name: t('account.wishlist'), href: '/account/wishlist', icon: Heart },
  ];

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 font-sans">
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block">{t('account.myAccount')}</span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">{user ? `${user.name}` : t('account.myAccount')}</h1>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-2 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm h-fit">
          {accountLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-[#0F4C3A] text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" /> {link.name}
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors mt-4 border-t border-slate-100"
          >
            <LogOut className="w-4 h-4" /> {t('auth.logout')}
          </button>
        </aside>

        <main className="lg:col-span-9 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-card">
          {children}
        </main>
      </div>
    </div>
  );
}
