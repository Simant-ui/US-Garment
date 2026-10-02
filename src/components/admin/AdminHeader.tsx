'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, Sun, Moon, ExternalLink } from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function AdminHeader() {
  const { theme, toggleTheme } = useAdminTheme();
  const { user } = useAuth();

  const isDark = theme === 'dark';

  return (
    <header
      className={`h-16 px-6 border-b flex items-center justify-between sticky top-0 z-40 transition-colors duration-200 ${
        isDark ? 'bg-[#081222] border-[#1E304A] text-white' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
      }`}
    >
      {/* Left Side: Status Dot + Hub Title */}
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
        <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          US GARMENT ADMINISTRATION • HETAUDA HUB
        </span>
      </div>

      {/* Right Side: Search, Notification Bell, Sun/Moon Toggle, Avatar, View Storefront */}
      <div className="flex items-center space-x-3">
        {/* Search Icon Button */}
        <button
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'hover:bg-[#101D32] text-[#94A3B8]' : 'hover:bg-[#F1F5F9] text-[#64748B]'
          }`}
          aria-label="Search Dashboard"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-[#101D32] text-[#94A3B8]' : 'hover:bg-[#F1F5F9] text-[#64748B]'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white font-extrabold text-[9px] rounded-full flex items-center justify-center border-2 border-white dark:border-[#081222]">
            3
          </span>
        </div>

        {/* Sun / Moon Theme Toggle Switch */}
        <button
          onClick={toggleTheme}
          className={`px-2.5 py-1.5 rounded-full flex items-center gap-2 border transition-all ${
            isDark
              ? 'bg-[#101D32] border-[#1E304A] text-[#10D990]'
              : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#10B981]'
          }`}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#10D990]" />
              <span className="text-[10px] font-bold text-white uppercase">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-[10px] font-bold text-[#0F172A] uppercase">Light</span>
            </>
          )}
        </button>

        {/* Circular Admin Avatar */}
        <div className="w-7 h-7 rounded-full bg-[#10B981] text-white text-xs font-bold flex items-center justify-center shadow-xs">
          A
        </div>

        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          className={`text-xs font-bold flex items-center gap-1 transition-colors ${
            isDark ? 'text-white hover:text-[#10D990]' : 'text-[#0F172A] hover:text-[#10B981]'
          }`}
        >
          View Storefront <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
