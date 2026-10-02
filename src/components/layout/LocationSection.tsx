'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Loader2, Store } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const DESTINATION_LAT = 27.403028;
const DESTINATION_LNG = 85.072142;
const MAPS_SHARE_URL = 'https://maps.app.goo.gl/Wb964rQWePpvrr1u8?g_st=awb';
const EMBED_MAP_URL = `https://maps.google.com/maps?q=${DESTINATION_LAT},${DESTINATION_LNG}&hl=en&z=16&output=embed`;

export default function LocationSection() {
  const { t } = useLanguage();
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetDirections = () => {
    const destination = `${DESTINATION_LAT},${DESTINATION_LNG}`;
    const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsGettingLocation(true);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsGettingLocation(false);
          const { latitude, longitude } = position.coords;
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}`;
          window.open(directionsUrl, '_blank', 'noopener,noreferrer');
        },
        (_error) => {
          // Fallback if user denies permission, timeout, or location is unavailable
          setIsGettingLocation(false);
          window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0,
        }
      );
    } else {
      // Fallback for browsers without Geolocation API
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      aria-labelledby="location-heading"
      className="container mx-auto px-4 max-w-7xl py-6 md:py-10"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Location Information & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            
            {/* Header & Subtitle */}
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#0F4C3A] flex items-center justify-center mb-4 shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <h2
                id="location-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#10233F] tracking-tight"
              >
                {t('location.title')}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium leading-relaxed">
                {t('location.subtitle')}
              </p>
            </div>

            {/* Address & Store Card */}
            <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="flex items-start gap-3">
                <Store className="w-5 h-5 text-[#0F4C3A] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[#10233F] text-base">
                    {t('location.addressTitle')}
                  </h3>
                  <p className="text-slate-600 text-sm mt-0.5 font-medium">
                    {t('location.addressText')}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span className="font-semibold text-slate-700">GPS:</span>
                <span>{DESTINATION_LAT}, {DESTINATION_LNG}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 pt-1">
              
              {/* PRIMARY CTA: Get Directions */}
              <button
                type="button"
                onClick={handleGetDirections}
                disabled={isGettingLocation}
                className="w-full sm:w-1/2 lg:w-full xl:w-1/2 px-6 py-3.5 bg-[#0F4C3A] hover:bg-[#0B3B2D] active:bg-[#082C22] text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
                aria-label={t('location.getDirections')}
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>{t('location.gettingDirections')}</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform" />
                    <span>{t('location.getDirections')}</span>
                  </>
                )}
              </button>

              {/* SECONDARY CTA: View on Google Maps */}
              <a
                href={MAPS_SHARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 lg:w-full xl:w-1/2 px-6 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-[#0F4C3A] font-bold border-2 border-[#0F4C3A] rounded-xl shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#0F4C3A] focus:ring-offset-2 group"
                aria-label={t('location.viewOnGoogleMaps')}
              >
                <ExternalLink className="w-5 h-5 text-[#0F4C3A] group-hover:scale-110 transition-transform" />
                <span>{t('location.viewOnGoogleMaps')}</span>
              </a>

            </div>

          </div>

          {/* RIGHT SIDE: Embedded Google Map */}
          <div className="lg:col-span-7">
            <div className="w-full h-[280px] sm:h-[350px] lg:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-inner bg-slate-100 relative group">
              <iframe
                src={EMBED_MAP_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('location.iframeTitle')}
                aria-label={t('location.iframeTitle')}
                className="w-full h-full rounded-2xl sm:rounded-3xl"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
