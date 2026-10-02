'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Scissors,
  Truck,
  Tag,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAdminTheme } from '@/context/ThemeContext';
import BrandLogo from '@/components/common/BrandLogo';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme } = useAdminTheme();

  const isDark = theme === 'dark';

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Custom Orders', href: '/admin/custom-orders', icon: Scissors },
    { name: 'Wholesale Bulk', href: '/admin/wholesale', icon: Truck },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'CMS Content', href: '/admin/content', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={`w-60 min-h-screen p-4 flex flex-col justify-between border-r flex-shrink-0 transition-colors duration-200 ${
        isDark
          ? 'bg-[#0B1528] border-[#1E304A] text-[#94A3B8]'
          : 'bg-white border-[#E2E8F0] text-[#64748B]'
      }`}
    >
      <div className="space-y-5">
        {/* Top Branding */}
        <div className={`pb-4 border-b ${isDark ? 'border-[#1E304A]' : 'border-[#E2E8F0]'}`}>
          <BrandLogo variant="admin" size="md" isDark={isDark} href="/admin" />
        </div>

        {/* Sidebar Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            let activeStyles = '';
            if (isActive) {
              activeStyles = isDark
                ? 'bg-[#064E3B]/60 text-white font-bold border-l-2 border-[#10D990]'
                : 'bg-[#ECFDF5] text-[#0F172A] font-bold border-l-2 border-[#10B981]';
            } else {
              activeStyles = isDark
                ? 'text-[#94A3B8] hover:bg-[#101D32] hover:text-white'
                : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]';
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${activeStyles}`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? isDark
                          ? 'text-[#10D990]'
                          : 'text-[#10B981]'
                        : 'text-current'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      isDark ? 'text-[#10D990]' : 'text-[#10B981]'
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Area */}
      <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-[#1E304A]' : 'border-[#E2E8F0]'}`}>
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-[#10B981] text-white font-bold flex items-center justify-center text-xs shadow-sm">
            A
          </div>
          <div>
            <p className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              {user?.name || 'Super Admin'}
            </p>
            <p className={`text-[10px] uppercase font-semibold ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              ROLE: {user?.role || 'SUPER_ADMIN'}
            </p>
          </div>
        </div>

        {/* Full-width Exit Admin Button */}
        <button
          onClick={logout}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            isDark
              ? 'bg-[#451A1A]/60 text-[#FB4F64] hover:bg-[#5C2222]/80 border border-[#7A2929]/40'
              : 'bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2] border border-[#FCA5A5]/30'
          }`}
        >
          <LogOut className="w-4 h-4" /> Exit Admin
        </button>
      </div>
    </aside>
  );
}
