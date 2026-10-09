'use client';

import React from 'react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import LocationSection from '@/components/layout/LocationSection';

export default function ContactPageClient() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12 font-sans">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#0F4C3A] uppercase tracking-widest block">{t('pages.contact.getInTouch')}</span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">{t('pages.contact.title')}</h1>
        <p className="text-sm text-slate-600">{t('pages.contact.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <MapPin className="w-6 h-6 text-[#0F4C3A]" />
          <h3 className="font-bold text-slate-900 text-sm">{t('pages.contact.addressTitle')}</h3>
          <p className="text-xs text-slate-600">{t('pages.contact.addressDesc')}</p>
          <a href={SITE_CONFIG.mapUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#0F4C3A] hover:underline block pt-1">
            Google Maps →
          </a>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <Phone className="w-6 h-6 text-[#0F4C3A]" />
          <h3 className="font-bold text-slate-900 text-sm">{t('pages.contact.phoneTitle')}</h3>
          <p className="text-xs text-slate-600">{SITE_CONFIG.phone}</p>
          <p className="text-xs text-slate-600">{SITE_CONFIG.secondaryPhone}</p>
          <p className="text-xs text-slate-600">{SITE_CONFIG.thirdPhone}</p>
          <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 pt-1">
            <MessageCircle className="w-3.5 h-3.5" /> {t('topBar.whatsappUs')}
          </a>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <Mail className="w-6 h-6 text-[#0F4C3A]" />
          <h3 className="font-bold text-slate-900 text-sm">{t('pages.contact.emailTitle')}</h3>
          <p className="text-xs text-slate-600">{SITE_CONFIG.email}</p>
          <p className="text-xs text-slate-500 pt-1">{t('pages.contact.workingHoursValue')}</p>
        </div>
      </div>

      <LocationSection />
    </div>
  );
}
