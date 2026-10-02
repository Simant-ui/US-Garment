'use client';

import React from 'react';
import { Truck, ShieldCheck, Factory, Award } from 'lucide-react';
import WholesaleInquiryForm from '@/components/forms/WholesaleInquiryForm';
import { useLanguage } from '@/context/LanguageContext';

export default function WholesalePageClient() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12 font-sans">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#10233F] text-xs font-bold uppercase">
          <Factory className="w-4 h-4 text-[#D4AF37]" /> {t('wholesale.title')}
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">
          {t('wholesale.title')}
        </h1>
        <p className="text-sm text-slate-600">
          {t('wholesale.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <Award className="w-8 h-8 text-[#0F4C3A]" />
          <h3 className="font-bold text-slate-900 text-base">{t('home.feature3Title')}</h3>
          <p className="text-xs text-slate-500">{t('home.feature3Desc')}</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <ShieldCheck className="w-8 h-8 text-[#0F4C3A]" />
          <h3 className="font-bold text-slate-900 text-base">{t('home.trustBadgeTitle')}</h3>
          <p className="text-xs text-slate-500">{t('home.trustBadgeDesc')}</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <Truck className="w-8 h-8 text-[#0F4C3A]" />
          <h3 className="font-bold text-slate-900 text-base">{t('home.feature4Title')}</h3>
          <p className="text-xs text-slate-500">{t('home.feature4Desc')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-bold text-slate-900">{t('wholesale.orderTitle')}</h2>
          <p className="text-xs text-slate-500">{t('wholesale.subtitle')}</p>
        </div>
        <WholesaleInquiryForm />
      </div>
    </div>
  );
}
