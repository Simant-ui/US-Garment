'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { ThemeProvider, useAdminTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { theme } = useAdminTheme();

  const isDark = theme === 'dark';

  const isLoginPage = pathname === '/admin/login';
  const isAdminRole = user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'].includes(user.role);

  useEffect(() => {
    if (!isLoginPage && !loading) {
      if (!isAdminRole) {
        router.replace('/admin/login');
      }
    }
  }, [isLoginPage, loading, isAdminRole, router]);

  if (isLoginPage) {
    return <main className="min-h-screen bg-[#050B18] flex items-center justify-center p-4">{children}</main>;
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050B18] text-[#10D990]' : 'bg-[#F6F8FB] text-[#10B981]'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wide">Verifying Admin Permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdminRole) {
    return null; // Prevents flashing of admin layout/content before router redirect
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
