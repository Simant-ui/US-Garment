'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';

export default function AdminCouponsPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState(10);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) setCoupons(data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          discountType: 'PERCENTAGE',
          discountValue: Number(discountValue),
          minOrderAmount: 1000,
          expiryDate: new Date('2027-12-31'),
          isActive: true,
        }),
      });
      if (res.ok) {
        setCode('');
        fetchCoupons();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <div>
        <h1 className={`text-2xl md:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Coupon & Discount Management
        </h1>
        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          Create promotional promo codes for US Dresses Udyog customers.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className={`p-6 rounded-2xl border space-y-4 text-xs transition-colors ${
          isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0] shadow-xs'
        }`}
      >
        <h3 className={`font-serif font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Create New Promo Code
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Coupon Code *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. FESTIVE10"
              className={`w-full rounded-xl p-3 text-xs font-bold uppercase border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Discount (%) *
            </label>
            <input
              type="number"
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className={`w-full rounded-xl p-3 text-xs font-semibold border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>
        </div>
        <button
          type="submit"
          className={`px-5 py-2.5 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all ${
            isDark ? 'bg-[#10D990] text-[#050B18] hover:bg-[#0EB87B]' : 'bg-[#10B981] text-white hover:bg-[#059669]'
          }`}
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </form>

      <div
        className={`rounded-2xl border p-6 space-y-4 transition-colors ${
          isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0] shadow-xs'
        }`}
      >
        <h3 className={`font-serif font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Active Coupons ({coupons.length})
        </h3>
        {loading ? (
          <Loader2 className={`w-6 h-6 animate-spin mx-auto ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`} />
        ) : (
          <div className={`divide-y text-xs ${isDark ? 'divide-[#1E304A]' : 'divide-[#E2E8F0]'}`}>
            {coupons.map((c) => (
              <div key={c.id || c._id || c.code} className="py-3 flex justify-between items-center">
                <div>
                  <p className={`font-bold font-mono ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{c.code}</p>
                  <p className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    {c.discountValue}% Discount | Min Order: NPR {c.minOrderAmount}
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  isDark ? 'bg-[#064E3B] text-[#10D990]' : 'bg-[#ECFDF5] text-[#10B981]'
                }`}>
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
