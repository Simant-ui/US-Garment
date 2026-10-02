'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'topbar' | 'header' | 'mobile';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'topbar', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ne', label: 'नेपाली', flag: '🇳🇵' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center gap-2 p-2 bg-emerald-50/60 rounded-xl border border-emerald-100 ${className}`}>
        <Globe className="w-4 h-4 text-[#0F4C3A]" />
        <span className="text-xs font-medium text-slate-600 mr-auto">भाषा / Language:</span>
        <div className="flex bg-white rounded-lg p-0.5 border border-slate-200 shadow-xs">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                language === lang.code
                  ? 'bg-[#0F4C3A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-xs font-semibold rounded-full transition-all focus:outline-none ${
          variant === 'topbar'
            ? 'px-2.5 py-1 bg-white/80 hover:bg-white text-[#10233F] border border-[#C5E5D8] shadow-xs'
            : 'px-3 py-1.5 bg-[#F1F8F5] hover:bg-[#E6F4EE] text-[#0F4C3A] border border-[#D0EAE0]'
        }`}
        aria-label="Select Language"
      >
        <span className="text-sm leading-none">{currentLangObj.flag}</span>
        <span className="font-bold tracking-tight">{currentLangObj.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Choose Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                language === lang.code
                  ? 'bg-[#E6F4EE] text-[#0F4C3A] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-[#0F4C3A]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
