'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import BrandLogo from '@/components/common/BrandLogo';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans">
      {/* Value Proposition Badges */}
      <div className="container mx-auto px-4 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-slate-800/60 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-800/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t('home.feature1Title')}</h4>
              <p className="text-xs text-slate-400">{t('home.feature1Desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-800/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t('cart.freeShippingTag')}</h4>
              <p className="text-xs text-slate-400">{t('topBar.location')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-800/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t('home.feature2Title')}</h4>
              <p className="text-xs text-slate-400">{t('home.feature2Desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-800/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t('home.feature3Title')}</h4>
              <p className="text-xs text-slate-400">{t('home.feature3Desc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
        {/* Col 1: Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <BrandLogo variant="store" size="lg" isDark={true} />
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            {t('footer.brandDesc')}
          </p>

          <div className="space-y-2 text-xs text-slate-300 pt-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{t('pages.contact.addressDesc')}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-emerald-400 transition-colors">
                {SITE_CONFIG.phone} / {SITE_CONFIG.secondaryPhone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-emerald-400 transition-colors">
                {SITE_CONFIG.email}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t('pages.contact.workingHoursValue')}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-3">
            {t('footer.categories')}
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/women" className="hover:text-white transition-colors">{t('nav.women')}</Link></li>
            <li><Link href="/school-uniform" className="hover:text-white transition-colors">{t('nav.schoolUniform')}</Link></li>
            <li><Link href="/house-dress" className="hover:text-white transition-colors">{t('nav.houseDress')}</Link></li>
            <li><Link href="/t-shirts" className="hover:text-white transition-colors">{t('nav.tShirts')}</Link></li>
            <li><Link href="/dresses" className="hover:text-white transition-colors">{t('nav.dresses')}</Link></li>
            <li><Link href="/track-suits" className="hover:text-white transition-colors">{t('nav.trackSuits')}</Link></li>
          </ul>
        </div>

        {/* Col 3: Business Services */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-3">
            {t('nav.customOrders')} & {t('nav.wholesale')}
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/custom-stitching" className="hover:text-white transition-colors">{t('customTailoring.title')}</Link></li>
            <li><Link href="/wholesale" className="hover:text-white transition-colors">{t('wholesale.title')}</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">{t('nav.services')}</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
          </ul>
        </div>

        {/* Col 4: Help & Policies */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-3">
            {t('footer.customerService')}
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">{t('nav.faq')}</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-white transition-colors">{t('pages.shipping.title')}</Link></li>
            <li><Link href="/return-policy" className="hover:text-white transition-colors">{t('pages.return.title')}</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">{t('pages.privacy.title')}</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">{t('pages.terms.title')}</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="container mx-auto px-4 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} {t('footer.developedWith')}. {t('footer.rightsReserved')}.</p>
        <div className="flex items-center space-x-6 text-slate-400">
          <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a>
          <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href={SITE_CONFIG.social.tiktok} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TikTok</a>
          <a href={SITE_CONFIG.social.youtube} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
