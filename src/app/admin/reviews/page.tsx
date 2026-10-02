'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';

export default function AdminReviewsPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className={`text-2xl md:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Customer Reviews & Moderation
        </h1>
        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          Moderate customer feedback and garment product ratings for US Dresses Udyog.
        </p>
      </div>
      <div className={`p-12 rounded-2xl border text-center text-xs space-y-3 transition-colors ${
        isDark ? 'bg-[#0D192D] border-[#1E304A] text-[#94A3B8]' : 'bg-white border-[#E2E8F0] text-[#64748B] shadow-xs'
      }`}>
        <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${
          isDark ? 'bg-[#101D32] text-[#10D990]' : 'bg-[#ECFDF5] text-[#10B981]'
        }`}>
          <MessageSquare className="w-6 h-6" />
        </div>
        <p className="font-semibold text-sm">Product Reviews Moderation Queue</p>
        <p className="max-w-md mx-auto text-xs">
          Approved customer feedback and star ratings will automatically feature on product detail storefront pages.
        </p>
      </div>
    </div>
  );
}
