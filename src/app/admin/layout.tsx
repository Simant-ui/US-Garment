'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { ThemeProvider, useAdminTheme } from '@/context/ThemeContext';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useAdminTheme();

  const isDark = theme === 'dark';

  if (pathname === '/admin/login') {
    return <main className="min-h-screen bg-[#050B18] flex items-center justify-center p-4">{children}</main>;
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${isDark ? 'bg-[#050B18] text-[#F8FAFC]' : 'bg-[#F6F8FB] text-[#0F172A]'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
  );
}
