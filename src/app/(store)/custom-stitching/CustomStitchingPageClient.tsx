'use client';

import React from 'react';
import { Scissors } from 'lucide-react';
import CustomOrderForm from '@/components/forms/CustomOrderForm';
import { useLanguage } from '@/context/LanguageContext';

export default function CustomStitchingPageClient() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 font-sans">
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4EE] text-[#0F4C3A] text-xs font-bold uppercase">
          <Scissors className="w-4 h-4 text-[#0F4C3A]" /> {t('customTailoring.title')}
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">
          {t('customTailoring.orderTitle')}
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          {t('customTailoring.subtitle')}
        </p>
      </div>

      <CustomOrderForm />
    </div>
  );
}
