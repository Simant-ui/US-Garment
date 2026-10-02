'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPageClient() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12 font-sans">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-14 text-center space-y-4">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block">
          {t('nav.about')}
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold">
          {t('pages.about.title')}
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('pages.about.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <h2 className="text-2xl font-serif font-bold text-slate-900">{t('pages.about.storyTitle')}</h2>
          <p>
            {t('pages.about.storyDesc')}
          </p>
          <h2 className="text-2xl font-serif font-bold text-slate-900 pt-4">{t('pages.about.missionTitle')}</h2>
          <p>
            {t('pages.about.missionDesc')}
          </p>
        </div>

        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
            alt="US Garment Factory Production Hetauda"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
