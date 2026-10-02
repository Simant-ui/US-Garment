'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 py-20 text-center font-sans space-y-6">
      <div className="w-24 h-24 rounded-full bg-[#E6F4EE] text-[#0F4C3A] flex items-center justify-center mx-auto shadow-sm">
        <FileQuestion className="w-12 h-12" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block">
          404 Error
        </span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
          {t('pages.notFound.title')}
        </h1>
        <p className="text-sm text-slate-600">
          {t('pages.notFound.desc')}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <Link
          href="/"
          className="px-8 py-3.5 bg-[#0F4C3A] hover:bg-[#0B3B2D] text-white font-bold rounded-2xl shadow-md transition-all text-xs inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>{t('pages.notFound.backHome')}</span>
        </Link>
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-all text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('nav.shop')}</span>
        </Link>
      </div>
    </div>
  );
}
