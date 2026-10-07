'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Megaphone, Calendar, ExternalLink, Phone, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getActiveAnnouncements, trackAnnouncementEvent, AnnouncementData } from '@/services/api/announcementApi';

export default function AnnouncementPopup() {
  const { language } = useLanguage();
  const [activeAnnouncement, setActiveAnnouncement] = useState<AnnouncementData | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  const checkFrequencyAndShow = useCallback((announcement: AnnouncementData) => {
    const id = announcement.id || announcement._id;
    if (!id) return false;

    const now = Date.now();

    // Check "Do not show again" persistent flag
    const dismissedForever = localStorage.getItem(`us_garment_announcement_dismissed_${id}`);
    if (dismissedForever === 'true') return false;

    const frequency = announcement.displayFrequency;

    if (frequency === 'once_session') {
      const sessionShown = sessionStorage.getItem(`us_garment_announcement_session_${id}`);
      if (sessionShown === 'true') return false;
    } else if (frequency === 'once_day') {
      const lastShown = localStorage.getItem(`us_garment_announcement_day_${id}`);
      if (lastShown) {
        const lastShownTime = parseInt(lastShown, 10);
        // Check if 24 hours have passed
        if (now - lastShownTime < 24 * 60 * 60 * 1000) return false;
      }
    } else if (frequency === 'once_only') {
      const shownOnce = localStorage.getItem(`us_garment_announcement_once_${id}`);
      if (shownOnce === 'true') return false;
    }

    return true;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadAnnouncements = async () => {
      try {
        const list = await getActiveAnnouncements();
        if (!list || list.length === 0) return;

        // Find the top priority announcement that satisfies frequency rules
        for (const item of list) {
          if (checkFrequencyAndShow(item)) {
            if (isMounted) {
              setActiveAnnouncement(item);
              setIsOpen(true);
              const itemId = item.id || item._id;
              if (itemId) trackAnnouncementEvent(itemId, 'view');
            }
            break;
          }
        }
      } catch (err) {
        console.error('Failed to load active announcements:', err);
      }
    };

    loadAnnouncements();

    return () => {
      isMounted = false;
    };
  }, [checkFrequencyAndShow]);

  const handleClose = useCallback(() => {
    const id = activeAnnouncement?.id || activeAnnouncement?._id;
    if (!activeAnnouncement || !id) {
      setIsOpen(false);
      return;
    }

    const frequency = activeAnnouncement.displayFrequency;
    const now = Date.now();

    if (dontShowAgain) {
      localStorage.setItem(`us_garment_announcement_dismissed_${id}`, 'true');
    }

    if (frequency === 'once_session') {
      sessionStorage.setItem(`us_garment_announcement_session_${id}`, 'true');
    } else if (frequency === 'once_day') {
      localStorage.setItem(`us_garment_announcement_day_${id}`, `${now}`);
    } else if (frequency === 'once_only') {
      localStorage.setItem(`us_garment_announcement_once_${id}`, 'true');
    }

    trackAnnouncementEvent(id, 'dismissal');
    setIsOpen(false);
  }, [activeAnnouncement, dontShowAgain]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !activeAnnouncement) return null;

  const isNe = language === 'ne';

  const title = isNe
    ? activeAnnouncement.title?.ne || activeAnnouncement.title?.en
    : activeAnnouncement.title?.en || activeAnnouncement.title?.ne;

  const subtitle = isNe
    ? activeAnnouncement.subtitle?.ne || activeAnnouncement.subtitle?.en
    : activeAnnouncement.subtitle?.en || activeAnnouncement.subtitle?.ne;

  const content = isNe
    ? activeAnnouncement.content?.ne || activeAnnouncement.content?.en
    : activeAnnouncement.content?.en || activeAnnouncement.content?.ne;

  const highlightText = isNe
    ? activeAnnouncement.highlightText?.ne || activeAnnouncement.highlightText?.en
    : activeAnnouncement.highlightText?.en || activeAnnouncement.highlightText?.ne;

  const ctaText = isNe
    ? activeAnnouncement.ctaText?.ne || activeAnnouncement.ctaText?.en || 'बुझें'
    : activeAnnouncement.ctaText?.en || activeAnnouncement.ctaText?.ne || 'Got It';

  const handleCtaClick = () => {
    const annId = activeAnnouncement.id || activeAnnouncement._id;
    if (annId) {
      trackAnnouncementEvent(annId, 'click');
    }
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#050F1E]/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
      style={{ backgroundColor: 'rgba(5, 15, 30, 0.55)' }}
    >
      <div
        className="relative w-full max-w-[720px] max-h-[90vh] flex flex-col bg-white rounded-[22px] shadow-2xl overflow-hidden border border-[#E2E8F0] transform transition-all duration-300 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button X */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur hover:bg-white text-[#475569] hover:text-[#0F172A] flex items-center justify-center shadow-md transition-all border border-slate-200"
          aria-label="Close Announcement"
        >
          <X className="w-5 h-5" />
        </button>

        {/* POPUP HEADER */}
        <div className="relative bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#991B1B] text-white p-5 md:p-6 pr-14 flex items-center gap-4 border-b-4 border-[#10B981]">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-[#DC2626] flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-emerald-400">
            <Megaphone className="w-6 h-6 md:w-7 md:h-7 animate-bounce-short" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-0.5 rounded-full mb-1">
              {isNe ? 'आधिकारिक सूचना' : 'OFFICIAL NOTICE'}
            </span>
            <h2 className="text-lg md:text-xl font-bold leading-tight text-white font-devanagari tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs md:text-sm text-red-100 mt-1 font-devanagari opacity-95">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* POPUP BODY */}
        <div className="p-5 md:p-6 space-y-4 overflow-y-auto max-h-[60vh] text-[#334155]">
          {/* Optional Banner Image */}
          {activeAnnouncement.image && (
            <div className="relative w-full h-48 md:h-60 rounded-xl overflow-hidden shadow-inner border border-slate-200">
              <Image
                src={activeAnnouncement.image}
                alt={title || 'Notice'}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Main Greeting / Description */}
          <div
            className="text-sm md:text-base leading-relaxed text-[#1E293B] font-devanagari prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Optional Highlight Info Box */}
          {highlightText && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border-l-4 border-[#EF4444] text-[#991B1B] text-sm md:text-base font-devanagari flex items-start gap-3 shadow-sm">
              <Calendar className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
              <div className="flex-1 whitespace-pre-line font-medium leading-relaxed">
                {highlightText}
              </div>
            </div>
          )}
        </div>

        {/* POPUP FOOTER */}
        <div className="border-t border-slate-200 bg-slate-50/90 p-4 md:p-5 space-y-4">
          {/* Top Footer info: Logo + Contact */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 border-b border-slate-200 pb-3">
            {/* Left: Official Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative flex-shrink-0 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="US Garment Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={(e) => {
                    // Fallback to text badge if logo fails
                    (e.target as any).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <p className="font-bold text-[#0F172A] tracking-tight">US DRESSES & GARMENT UDYOG</p>
                <p className="text-[11px] text-slate-500">Hetauda, Makawanpur, Nepal</p>
              </div>
            </div>

            {/* Right: Contact */}
            <div className="flex items-center gap-4 text-right text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>+977 9855012345</span>
              </div>
              <a
                href="https://wa.me/9779855012345"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition"
              >
                <MessageSquare className="w-3 h-3" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            {/* Checkbox "Do not show again" */}
            {activeAnnouncement.allowDoNotShowAgain ? (
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm font-medium text-slate-600 hover:text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="font-devanagari">
                  {isNe ? 'यो सूचना पुनः नदेखाउनुहोस्' : 'Do not show this notice again'}
                </span>
              </label>
            ) : <div />}

            {/* CTA Button / Dismiss Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {activeAnnouncement.ctaEnabled && activeAnnouncement.ctaUrl ? (
                <Link
                  href={activeAnnouncement.ctaUrl}
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm text-center shadow-md transition-all flex items-center justify-center gap-2 font-devanagari"
                >
                  <span>{ctaText}</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm text-center shadow-md transition-all font-devanagari"
                >
                  {ctaText}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
