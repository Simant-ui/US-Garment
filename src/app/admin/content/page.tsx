'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';

export default function AdminCMSContentPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [heroTitle, setHeroTitle] = useState('गुणस्तरीय पोशाक, विश्वास हाम्रो शान');
  const [heroDescription, setHeroDescription] = useState('Premier garment manufacturer based in Makwanpur, Hetauda. Specializing in handcrafted ladies kurthas, gowns, durable school uniforms, house dresses, active tracksuits, and custom tailoring services.');
  const [announcementText, setAnnouncementText] = useState('गुणस्तरीय उत्पादन, उचित मूल्य र समयमा डेलिभरी | School Uniform • House Dress • Ladies Wear');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <div>
        <h1 className={`text-2xl md:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Homepage CMS & Content Editor
        </h1>
        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          Update website headlines, hero banner text, and announcement bar without touching source code.
        </p>
      </div>

      {saved && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 font-semibold ${
          isDark ? 'bg-[#064E3B]/40 border-[#064E3B] text-[#10D990]' : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]'
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Homepage CMS content updated successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className={`p-6 rounded-2xl border space-y-6 text-xs transition-colors ${
          isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0] shadow-xs'
        }`}
      >
        <div className="space-y-4">
          <h3 className={`font-serif font-bold text-sm pb-2 border-b ${
            isDark ? 'text-white border-[#1E304A]' : 'text-[#0F172A] border-[#E2E8F0]'
          }`}>
            Hero Section Content
          </h3>
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Hero Main Headline (Nepali / English) *
            </label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className={`w-full rounded-xl p-3 text-xs font-bold border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Hero Supporting Text *
            </label>
            <textarea
              rows={3}
              required
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className={`w-full rounded-xl p-3 text-xs font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            ></textarea>
          </div>
        </div>

        <div className={`space-y-4 pt-4 border-t ${isDark ? 'border-[#1E304A]' : 'border-[#E2E8F0]'}`}>
          <h3 className={`font-serif font-bold text-sm pb-2 border-b ${
            isDark ? 'text-white border-[#1E304A]' : 'text-[#0F172A] border-[#E2E8F0]'
          }`}>
            Top Announcement Bar
          </h3>
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Announcement Text *
            </label>
            <input
              type="text"
              required
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className={`w-full rounded-xl p-3 text-xs font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`px-6 py-3 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all ${
            isDark ? 'bg-[#10D990] text-[#050B18] hover:bg-[#0EB87B]' : 'bg-[#10B981] text-white hover:bg-[#059669]'
          }`}
        >
          <Save className="w-4 h-4" /> Save CMS Changes
        </button>
      </form>
    </div>
  );
}
