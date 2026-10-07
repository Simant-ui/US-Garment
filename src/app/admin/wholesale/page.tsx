'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';

export default function AdminWholesalePage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wholesale');
      const data = await res.json();
      if (data.success) setInquiries(data.wholesaleInquiries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/wholesale/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className={`text-2xl md:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Wholesale & Institutional Bulk Inquiries
        </h1>
        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          Manage bulk garment requests from schools, hotels, and organizations in Makwanpur & Nepal.
        </p>
      </div>

      <div className={`rounded-2xl border overflow-hidden transition-colors ${
        isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0] shadow-xs'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className={`uppercase text-[10px] font-bold ${
              isDark ? 'bg-[#101D32] text-[#94A3B8]' : 'bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0]'
            }`}>
              <tr>
                <th className="p-3.5">Inquiry Ref</th>
                <th className="p-3.5">Organization</th>
                <th className="p-3.5">Contact Person</th>
                <th className="p-3.5">Product Required</th>
                <th className="p-3.5">Est. Quantity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Change Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1E304A]' : 'divide-[#E2E8F0]'}`}>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <Loader2 className={`w-6 h-6 animate-spin mx-auto ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`} />
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`text-center py-8 text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    No wholesale inquiries found. Wholesale bulk requests will appear here.
                  </td>
                </tr>
              ) : (
                inquiries.map((w) => {
                  const wId = w.id || w._id || w.inquiryNumber;
                  return (
                    <tr key={wId} className={`transition-colors ${isDark ? 'hover:bg-[#101D32]' : 'hover:bg-[#F8FAFC]'}`}>
                      <td className={`p-3.5 font-mono font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{w.inquiryNumber}</td>
                      <td className={`p-3.5 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{w.organizationName}</td>
                      <td className="p-3.5">
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{w.contactPerson}</p>
                        <p className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{w.phone}</p>
                      </td>
                      <td className={`p-3.5 font-semibold ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`}>{w.productType}</td>
                      <td className={`p-3.5 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{w.estimatedQuantity} units</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          isDark ? 'bg-amber-950 text-amber-300' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={w.status}
                          onChange={(e) => handleUpdateStatus(wId, e.target.value)}
                        className={`rounded-xl p-2 font-bold text-[11px] border outline-none transition-all ${
                          isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                        }`}
                      >
                        {['New', 'Contacted', 'Quoted', 'Negotiation', 'Confirmed', 'Production', 'Completed', 'Cancelled'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
