'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  ShoppingBag,
  Scissors,
  Truck,
  TrendingUp,
  Calendar,
  Plus,
  FileText,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';

export default function AdminDashboardPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className={`w-8 h-8 animate-spin mx-auto ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`} />
        <p className={`text-xs font-semibold ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          Loading Garment Business Dashboard...
        </p>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const recentOrders = data?.recentOrders || [];
  const recentCustom = data?.recentCustomOrders || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* MAIN CONTENT HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            Garment Business Dashboard
          </h1>
          <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            US Dresses and Garment Udyog • Hetauda, Nepal
          </p>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          {/* Calendar Today Dropdown */}
          <button
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
              isDark
                ? 'bg-[#0D192D] border-[#1E304A] text-white hover:bg-[#101D32]'
                : 'bg-white border-[#E2E8F0] text-[#0F172A] shadow-xs hover:bg-[#F8FAFC]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Today</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Green Primary Add Product Button */}
          <Link
            href="/admin/products"
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition-all ${
              isDark ? 'bg-[#10D990] hover:bg-[#0EB87B] text-[#050B18]' : 'bg-[#10B981] hover:bg-[#059669]'
            }`}
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* STATISTIC CARDS (4 Equal Responsive Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CARD 1: Total Revenue (Green) */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#0D192D] border-[#1E304A] shadow-none'
              : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#064E3B]/60 text-[#10D990]' : 'bg-[#ECFDF5] text-[#10B981]'}`}>
              <Wallet className="w-5 h-5" />
            </div>
            <TrendingUp className={`w-4 h-4 ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`} />
          </div>
          <span className={`text-xs font-semibold block ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Total Revenue
          </span>
          <p className={`text-xl font-extrabold mt-1 tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            NPR {(metrics.totalSales || 0).toLocaleString()}
          </p>
          <p className={`text-[11px] font-bold mt-2 ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`}>
            Today: NPR {(metrics.todaySales || 0).toLocaleString()}
          </p>
        </div>

        {/* CARD 2: Total Orders (Orange) */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#0D192D] border-[#1E304A] shadow-none'
              : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#451A03]/60 text-[#F59E0B]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <span className={`text-xs font-semibold block ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Total Orders
          </span>
          <p className={`text-xl font-extrabold mt-1 tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {metrics.totalOrders || 0}
          </p>
          <p className="text-[11px] font-bold mt-2 text-[#F59E0B]">
            {metrics.pendingOrders || 0} Pending Approval
          </p>
        </div>

        {/* CARD 3: Custom Stitching Inquiries (Purple) */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#0D192D] border-[#1E304A] shadow-none'
              : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#3B0764]/60 text-[#A855F7]' : 'bg-[#F3E8FF] text-[#8B5CF6]'}`}>
              <Scissors className="w-5 h-5" />
            </div>
            <TrendingUp className={`w-4 h-4 ${isDark ? 'text-[#A855F7]' : 'text-[#8B5CF6]'}`} />
          </div>
          <span className={`text-xs font-semibold block ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Custom Stitching Inquiries
          </span>
          <p className={`text-xl font-extrabold mt-1 tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {metrics.customOrdersCount || 0}
          </p>
          <Link
            href="/admin/custom-orders"
            className={`text-[11px] font-bold mt-2 block hover:underline ${isDark ? 'text-[#A855F7]' : 'text-[#8B5CF6]'}`}
          >
            Manage Custom Orders →
          </Link>
        </div>

        {/* CARD 4: Wholesale Bulk Requests (Blue) */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#0D192D] border-[#1E304A] shadow-none'
              : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#172554]/60 text-[#2196F3]' : 'bg-[#EFF6FF] text-[#3B82F6]'}`}>
              <Truck className="w-5 h-5" />
            </div>
            <TrendingUp className={`w-4 h-4 ${isDark ? 'text-[#2196F3]' : 'text-[#3B82F6]'}`} />
          </div>
          <span className={`text-xs font-semibold block ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Wholesale Bulk Requests
          </span>
          <p className={`text-xl font-extrabold mt-1 tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {metrics.wholesaleCount || 0}
          </p>
          <Link
            href="/admin/wholesale"
            className={`text-[11px] font-bold mt-2 block hover:underline ${isDark ? 'text-[#2196F3]' : 'text-[#3B82F6]'}`}
          >
            Manage Wholesale Quotes →
          </Link>
        </div>
      </div>

      {/* RECENT ACTIVITY SECTION (2 Equal Large Cards with Empty States) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT CARD: Recent Customer Orders */}
        <div
          className={`p-6 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              Recent Customer Orders
            </h3>
            <Link
              href="/admin/orders"
              className={`text-xs font-bold hover:underline ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`}
            >
              View All →
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="divide-y text-xs">
              {recentOrders.map((o: any) => (
                <div key={o._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className={`font-bold font-mono ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>#{o.orderNumber}</p>
                    <p className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>{o.shippingAddress?.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>NPR {o.totalAmount?.toLocaleString()}</p>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${isDark ? 'bg-[#064E3B] text-[#10D990]' : 'bg-[#ECFDF5] text-[#10B981]'}`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Centered Empty State */
            <div className="py-10 text-center space-y-3 my-auto">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isDark ? 'bg-[#101D32] text-[#94A3B8]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                <FileText className="w-8 h-8 opacity-60" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  No recent orders.
                </h4>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Customer orders will appear here once placed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CARD: Recent Custom Stitching Requests */}
        <div
          className={`p-6 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              Recent Custom Stitching Requests
            </h3>
            <Link
              href="/admin/custom-orders"
              className={`text-xs font-bold hover:underline ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`}
            >
              View All →
            </Link>
          </div>

          {recentCustom.length > 0 ? (
            <div className="divide-y text-xs">
              {recentCustom.map((c: any) => (
                <div key={c._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{c.fullName}</p>
                    <p className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>{c.garmentType} ({c.quantity} pcs)</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${isDark ? 'bg-[#3B0764] text-[#A855F7]' : 'bg-[#F3E8FF] text-[#8B5CF6]'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* Centered Sewing Machine Empty State */
            <div className="py-10 text-center space-y-3 my-auto">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isDark ? 'bg-[#101D32] text-[#94A3B8]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                <Scissors className="w-8 h-8 opacity-60" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  No recent custom requests.
                </h4>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Custom stitching inquiries will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ANALYTICS SECTION (Sales Overview Line Chart + Order Status Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CARD (65–70% width): Sales Overview Line Chart */}
        <div
          className={`lg:col-span-8 p-6 rounded-2xl border space-y-6 ${
            isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}
        >
          <div className="flex justify-between items-center">
            <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
              Sales Overview
            </h3>
            <button
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
              }`}
            >
              <span>Last 7 Days</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-64 pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              {[0, 40, 80, 120, 160, 200].map((y) => (
                <line
                  key={y}
                  x1="40"
                  y1={y}
                  x2="700"
                  y2={y}
                  stroke={isDark ? '#1E304A' : '#F1F5F9'}
                  strokeWidth="1"
                />
              ))}

              {/* Y-Axis Labels */}
              <text x="5" y="5" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="11" fontWeight="600">1.0</text>
              <text x="5" y="45" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="11" fontWeight="600">0.8</text>
              <text x="5" y="85" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="11" fontWeight="600">0.6</text>
              <text x="5" y="125" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="11" fontWeight="600">0.4</text>
              <text x="5" y="165" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="11" fontWeight="600">0.2</text>
              <text x="5" y="200" fill={isDark ? '#94A3B8' : '#64748B'} fontSize="11" fontWeight="600">0</text>

              {/* Line at Zero */}
              <line
                x1="50"
                y1="190"
                x2="680"
                y2="190"
                stroke={isDark ? '#10D990' : '#10B981'}
                strokeWidth="3"
              />

              {/* Data Node Dots */}
              {[50, 155, 260, 365, 470, 575, 680].map((x, idx) => (
                <circle
                  key={idx}
                  cx={x}
                  cy="190"
                  r="5"
                  fill={isDark ? '#10D990' : '#10B981'}
                  stroke={isDark ? '#0D192D' : '#FFFFFF'}
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* X-Axis Date Labels */}
            <div className="flex justify-between pl-10 pr-2 pt-3 text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8]">
              <span>Oct 23</span>
              <span>Oct 24</span>
              <span>Oct 25</span>
              <span>Oct 26</span>
              <span>Oct 27</span>
              <span>Oct 28</span>
              <span>Oct 29</span>
            </div>
          </div>
        </div>

        {/* RIGHT CARD (30–35% width): Order Status Donut Chart */}
        <div
          className={`lg:col-span-4 p-6 rounded-2xl border space-y-6 flex flex-col justify-between ${
            isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0] shadow-xs'
          }`}
        >
          <h3 className={`font-serif font-bold text-base ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            Order Status
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Track Circle */}
                <path
                  className={isDark ? 'text-[#101D32]' : 'text-slate-100'}
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Donut Segment */}
                <path
                  className="text-[#10B981]"
                  strokeDasharray="100, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  {metrics.totalOrders || 0}
                </span>
                <span className={`text-[10px] font-bold ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Total Orders
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2.5 text-xs font-semibold w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>Pending</span>
                </span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{metrics.pendingOrders || 0}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>Processing</span>
                </span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>0</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>Completed</span>
                </span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{metrics.deliveredOrders || 0}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                  <span className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>Cancelled</span>
                </span>
                <span className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
