'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'store' | 'admin';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isDark?: boolean;
  href?: string;
  className?: string;
}

export default function BrandLogo({
  variant = 'store',
  size = 'lg',
  isDark = false,
  href,
  className = '',
}: BrandLogoProps) {
  // Desktop logo width/height: 62px for lg, 52px for md, 42px for sm
  const dimensions = {
    sm: 42,
    md: 52,
    lg: 62,
    xl: 72,
  }[size];

  const targetHref = href || (variant === 'admin' ? '/admin' : '/');

  return (
    <Link href={targetHref} className={`flex items-center gap-3 group transition-transform ${className}`}>
      {/* 
        EXACT ATTACHED LOGO CONTAINER
        Exact local image file: /images/us-garment-official-logo.jpeg
        width: 62px, height: 62px, object-fit: contain, border-radius: 50%
      */}
      <div
        className={`relative flex items-center justify-center rounded-full bg-white border shadow-xs transition-transform group-hover:scale-105 flex-shrink-0 p-0.5 overflow-hidden ${
          isDark ? 'border-white/20 ring-2 ring-white/10' : 'border-slate-200/80'
        }`}
        style={{ width: `${dimensions}px`, height: `${dimensions}px` }}
      >
        <img
          src="/images/us-garment-official-logo.jpeg"
          alt="US Dresses & Garment Industry"
          className="w-full h-full object-contain rounded-full"
          style={{
            width: `${dimensions}px`,
            height: `${dimensions}px`,
            objectFit: 'contain',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Brand Text Branding */}
      <div className="flex flex-col">
        {variant === 'store' ? (
          <>
            <span
              className={`font-serif text-lg md:text-xl font-bold tracking-tight leading-none group-hover:text-[#0F4C3A] transition-colors ${
                isDark ? 'text-white' : 'text-[#10233F]'
              }`}
            >
              US Dresses
            </span>
            <span className="text-[10px] md:text-[11px] tracking-wider uppercase text-[#10B981] font-extrabold mt-1">
              & GARMENT UDYOG
            </span>
          </>
        ) : (
          <>
            <span
              className={`font-serif text-base md:text-lg font-bold tracking-tight leading-tight group-hover:text-[#10B981] transition-colors ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}
            >
              US Garment
            </span>
            <span className="text-[10px] text-[#10B981] font-extrabold uppercase tracking-widest block -mt-0.5">
              ADMIN CONTROL
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
