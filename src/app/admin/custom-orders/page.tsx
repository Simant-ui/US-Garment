'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';

export default function AdminCustomOrdersPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/custom-orders');
      const data = await res.json();
      if (data.success) setRequests(data.customOrders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/custom-orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className={`text-2xl md:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Custom Stitching & Tailoring Inquiries
        </h1>
        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          Manage custom orders, reference images, and tailoring quotations for US Dresses Udyog.
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
                <th className="p-3.5">Req Ref</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Garment Type</th>
                <th className="p-3.5">Qty</th>
                <th className="p-3.5">Location</th>
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
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`text-center py-8 text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    No custom tailoring inquiries found. Custom stitching inquiries will appear here.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r._id} className={`transition-colors ${isDark ? 'hover:bg-[#101D32]' : 'hover:bg-[#F8FAFC]'}`}>
                    <td className={`p-3.5 font-mono font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{r.requestNumber}</td>
                    <td className="p-3.5">
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{r.fullName}</p>
                      <p className={`text-[10px] ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{r.mobileNumber}</p>
                    </td>
                    <td className={`p-3.5 font-semibold ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`}>{r.garmentType}</td>
                    <td className={`p-3.5 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{r.quantity} pcs</td>
                    <td className={`p-3.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{r.deliveryLocation}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        isDark ? 'bg-purple-950 text-purple-300' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateStatus(r._id, e.target.value)}
                        className={`rounded-xl p-2 font-bold text-[11px] border outline-none transition-all ${
                          isDark ? 'bg-[#101D32] border-[#1E304A] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                        }`}
                      >
                        {['New', 'Contacted', 'Quotation Sent', 'Confirmed', 'Production', 'Completed', 'Cancelled'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
