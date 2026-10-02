'use client';

import React from 'react';
import Image from 'next/image';
import { GraduationCap } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import WholesaleInquiryForm from '@/components/forms/WholesaleInquiryForm';
import { useLanguage } from '@/context/LanguageContext';

export default function SchoolUniformPageClient({ uniformProducts }: { uniformProducts: any[] }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 pb-16 font-sans">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#10233F] via-[#0F4C3A] to-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" /> {t('nav.schoolUniform')}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
              {t('nav.schoolUniform')}
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#quote-form" className="px-8 py-4 bg-[#D4AF37] hover:bg-[#c09f2f] text-[#10233F] font-bold rounded-2xl shadow-xl transition-all text-sm">
                {t('home.requestWholesaleQuote')} →
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
                alt="School Uniform Nepal"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Uniform Products Catalog */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-900">
            {t('nav.schoolUniform')}
          </h2>
          <p className="text-sm text-slate-600">{t('shop.subtitle')}</p>
        </div>
        <ProductGrid products={uniformProducts} />
      </section>

      {/* Quote Form Section */}
      <section id="quote-form" className="container mx-auto px-4 max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('wholesale.orderTitle')}</h2>
          <p className="text-sm text-slate-600">{t('wholesale.subtitle')}</p>
        </div>
        <WholesaleInquiryForm />
      </section>
    </div>
  );
}
