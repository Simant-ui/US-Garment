'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Scissors,
  ShieldCheck,
  Sparkles,
  Award,
  Users,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import LocationSection from '@/components/layout/LocationSection';
import { useLanguage } from '@/context/LanguageContext';

const HERO_BG_IMAGE = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80';

interface HomePageClientProps {
  newArrivals: any[];
  bestSellers: any[];
  schoolUniforms: any[];
  categories: any[];
}

export default function HomePageClient({
  newArrivals,
  bestSellers,
  categories,
}: HomePageClientProps) {
  const { t, getBilingualText, language } = useLanguage();

  return (
    <div className="space-y-12 pb-16 bg-[#FAFCFB] font-sans">
      {/* 
        ==================================================
        FULL-WIDTH HERO SECTION
        ==================================================
      */}
      <section className="relative w-full min-h-[580px] md:min-h-[640px] flex flex-col justify-center border-b border-[#E2E8F0]">
        
        {/* Layer 1: Garment Showroom Store Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-700"
          style={{
            backgroundImage: `url('${HERO_BG_IMAGE}')`,
            opacity: 0.18,
          }}
        />

        {/* Layer 2: White & Light Mint Gradient Overlay Layer */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, rgba(248, 255, 252, 0.90) 0%, rgba(255, 255, 255, 0.85) 50%, rgba(241, 248, 245, 0.92) 100%)',
          }}
        />

        {/* Layer 3: Outer Edge Decorative Botanical Accents */}
        <div className="absolute top-6 left-4 w-40 h-40 opacity-10 pointer-events-none z-0 hidden md:block">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40,100 C70,20 150,20 180,100 C150,180 70,180 40,100 Z" fill="#10B981" />
            <path d="M60,100 C80,40 140,40 160,100" stroke="#0F4C3A" strokeWidth="4" />
          </svg>
        </div>
        <div className="absolute bottom-12 right-4 w-48 h-48 opacity-10 pointer-events-none z-0 hidden md:block">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="#10B981" strokeWidth="2" strokeDasharray="6 6" />
          </svg>
        </div>

        {/* CENTERED HERO CONTENT */}
        <div className="relative z-10 container mx-auto px-4 pt-14 pb-20 max-w-5xl text-center flex flex-col items-center justify-center space-y-7">
          
          {/* Main Headline (Large & High Contrast) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-serif font-extrabold text-center tracking-tight leading-[1.15] max-w-4xl mx-auto">
            {language === 'ne' ? (
              <>
                <span className="block text-[#10233F]">गुणस्तरीय पोशाक,</span>
                <span className="block text-[#D4AF37] mt-1.5 drop-shadow-xs">विश्वास हाम्रो शान</span>
              </>
            ) : (
              <>
                <span className="block text-[#10233F]">Quality Clothing,</span>
                <span className="block text-[#D4AF37] mt-1.5 drop-shadow-xs">Our Pride is Your Trust</span>
              </>
            )}
          </h1>

          {/* Centered Description */}
          <p className="text-base sm:text-lg md:text-xl text-[#334155] max-w-3xl mx-auto leading-relaxed font-medium text-center">
            {t('home.heroSubtitle')}
          </p>

          {/* 3 Centered CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3 w-full max-w-2xl mx-auto">
            {/* BUTTON 1: Shop Collection */}
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-[#0F4C3A] hover:bg-[#0B3B2D] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 text-sm md:text-base group"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{t('home.shopCollection')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* BUTTON 2: Custom Tailoring Order */}
            <Link
              href="/custom-stitching"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#F8FAFC] text-[#0F4C3A] font-bold rounded-2xl border-2 border-[#0F4C3A] shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2.5 text-sm md:text-base"
            >
              <Scissors className="w-5 h-5 text-[#0F4C3A]" />
              <span>{t('home.customOrderBtn')}</span>
            </Link>

            {/* BUTTON 3: Wholesale Inquiry */}
            <Link
              href="/wholesale"
              className="w-full sm:w-auto px-8 py-4 bg-[#E6F4EE] hover:bg-[#D4EBE1] text-[#0F4C3A] font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2.5 text-sm md:text-base"
            >
              <ShieldCheck className="w-5 h-5 text-[#0F4C3A]" />
              <span>{t('home.wholesaleBtn')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 
        ==================================================
        FLOATING 4-COLUMN FEATURE CARD
        ==================================================
      */}
      <div className="relative z-20 container mx-auto px-4 max-w-6xl -mt-14 md:-mt-16 mb-8">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          {/* 1. Premium Quality */}
          <div className="flex items-center gap-4 p-2 sm:pl-4 first:pl-2">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center flex-shrink-0 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#10233F] text-sm">{t('home.feature1Title')}</h4>
              <p className="text-xs text-slate-500 font-medium">{t('home.feature1Desc')}</p>
            </div>
          </div>

          {/* 2. Custom Orders */}
          <div className="flex items-center gap-4 p-2 sm:pl-4 pt-4 sm:pt-2">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center flex-shrink-0 shadow-xs">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#10233F] text-sm">{t('home.feature2Title')}</h4>
              <p className="text-xs text-slate-500 font-medium">{t('home.feature2Desc')}</p>
            </div>
          </div>

          {/* 3. Wholesale Support */}
          <div className="flex items-center gap-4 p-2 sm:pl-4 pt-4 sm:pt-2">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center flex-shrink-0 shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#10233F] text-sm">{t('home.feature3Title')}</h4>
              <p className="text-xs text-slate-500 font-medium">{t('home.feature3Desc')}</p>
            </div>
          </div>

          {/* 4. Hetauda, Nepal */}
          <div className="flex items-center gap-4 p-2 sm:pl-4 pt-4 sm:pt-2">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center flex-shrink-0 shadow-xs">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#10233F] text-sm">{t('home.feature4Title')}</h4>
              <p className="text-xs text-slate-500 font-medium">{t('home.feature4Desc')}</p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2 — FEATURED GARMENT CATEGORIES CARDS */}
      <section className="container mx-auto px-4 max-w-7xl pt-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <span className="text-xs font-bold text-[#0F4C3A] uppercase tracking-widest block mb-1">
              {t('home.exploreCategories')}
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#10233F]">
              {t('home.popularCategories')}
            </h2>
          </div>
          <Link href="/shop" className="text-sm font-bold text-[#0F4C3A] hover:underline flex items-center gap-1 mt-4 md:mt-0">
            {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => {
            const catName = getBilingualText(cat.name);
            const catDesc = getBilingualText(cat.description) || t('home.exploreCategories');
            return (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 bg-white border border-slate-100 flex flex-col h-64"
              >
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80'}
                    alt={catName}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow bg-white">
                  <div>
                    <h3 className="font-bold text-sm text-[#10233F] group-hover:text-[#0F4C3A] transition-colors">
                      {catName}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{catDesc}</p>
                  </div>
                  <span className="text-xs font-bold text-[#0F4C3A] flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-2">
                    {t('common.view')} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 3 — NEW ARRIVALS */}
      <section className="container mx-auto px-4 max-w-7xl py-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-[#0F4C3A] uppercase tracking-widest block mb-1">
              {t('home.handpickedCollection')}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#10233F]">
              {t('home.featuredProducts')}
            </h2>
          </div>
          <Link href="/new-arrivals" className="text-sm font-bold text-[#0F4C3A] hover:underline flex items-center gap-1">
            {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={newArrivals} />
      </section>

      {/* SECTION 4 — SCHOOL UNIFORMS & HOUSE DRESSES BANNER */}
      <section className="container mx-auto px-4 max-w-7xl my-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#10233F] to-[#0F4C3A] text-white p-8 md:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 bg-[#D4AF37] text-[#10233F] text-xs font-extrabold rounded-full uppercase tracking-wider inline-block">
              {t('home.wholesaleBannerTitle')}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
              {t('nav.schoolUniform')} & {t('nav.houseDress')}
            </h2>
            <p className="text-slate-200 text-sm md:text-base font-medium leading-relaxed">
              {t('home.wholesaleBannerDesc')}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <Link
                href="/school-uniform"
                className="px-6 py-3.5 bg-white text-[#10233F] hover:bg-slate-100 font-bold rounded-xl shadow-md transition-all text-sm"
              >
                {t('nav.schoolUniform')}
              </Link>
              <Link
                href="/wholesale"
                className="px-6 py-3.5 bg-[#D4AF37] text-[#10233F] hover:bg-[#c4a130] font-bold rounded-xl shadow-md transition-all text-sm"
              >
                {t('home.requestWholesaleQuote')}
              </Link>
            </div>
          </div>
          <div className="relative w-full md:w-80 h-72 rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80"
              alt="School Uniform Manufacturing Hetauda"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5 — BEST SELLERS */}
      <section className="container mx-auto px-4 max-w-7xl py-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold text-[#0F4C3A] uppercase tracking-widest block mb-1">
              {t('home.whyChooseUs')}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#10233F]">
              {t('home.trustBadgeTitle')}
            </h2>
          </div>
          <Link href="/best-sellers" className="text-sm font-bold text-[#0F4C3A] hover:underline flex items-center gap-1">
            {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={bestSellers} />
      </section>

      {/* SECTION 6 — OUR LOCATION */}
      <LocationSection />
    </div>
  );
}
