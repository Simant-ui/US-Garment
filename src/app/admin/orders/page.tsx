'use client';

import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';

export default function AdminOrdersPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder(data.order);
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className={`text-2xl md:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Order Management & Audit Tracking
        </h1>
        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          View customer orders, update statuses, and inspect audit histories for US Dresses Udyog.
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
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">City / Province</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Total (NPR)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1E304A]' : 'divide-[#E2E8F0]'}`}>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <Loader2 className={`w-6 h-6 animate-spin mx-auto ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`} />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`text-center py-8 text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                    No customer orders placed yet. Customer orders will appear here once placed.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className={`transition-colors ${isDark ? 'hover:bg-[#101D32]' : 'hover:bg-[#F8FAFC]'}`}>
                    <td className={`p-3.5 font-mono font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      #{o.orderNumber}
                    </td>
                    <td className={`p-3.5 font-medium ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      {o.shippingAddress?.fullName || 'Guest'}
                    </td>
                    <td className={`p-3.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                      {o.shippingAddress?.city}, {o.shippingAddress?.district}
                    </td>
                    <td className={`p-3.5 font-semibold ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                      {o.paymentMethod}
                    </td>
                    <td className={`p-3.5 font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                      NPR {o.totalAmount?.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        isDark ? 'bg-[#064E3B] text-[#10D990]' : 'bg-[#ECFDF5] text-[#10B981]'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setNewStatus(o.status);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                          isDark
                            ? 'bg-[#101D32] text-[#10D990] hover:bg-[#1E304A]'
                            : 'bg-[#F1F5F9] text-[#10B981] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)}></div>
          <div className={`relative w-full max-w-2xl p-6 rounded-3xl shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto text-xs border transition-colors ${
            isDark ? 'bg-[#0D192D] border-[#1E304A] text-white' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
          }`}>
            <div className={`flex justify-between items-center pb-3 border-b ${isDark ? 'border-[#1E304A]' : 'border-[#E2E8F0]'}`}>
              <h2 className={`text-base font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                Order Details: #{selectedOrder.orderNumber}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className={`font-bold text-base ${isDark ? 'text-[#94A3B8] hover:text-white' : 'text-[#64748B] hover:text-[#0F172A]'}`}>
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border space-y-1 ${
                isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
              }`}>
                <p className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                  Customer Shipping Address
                </p>
                <p className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                <p className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                <p className={isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}><strong>Address:</strong> {selectedOrder.shippingAddress?.addressLine}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.province}</p>
              </div>

              <div>
                <p className={`font-bold text-sm mb-2 ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Order Items</p>
                <div className={`divide-y rounded-2xl p-4 border ${
                  isDark ? 'bg-[#101D32] border-[#1E304A] divide-[#1E304A]' : 'bg-[#F8FAFC] border-[#E2E8F0] divide-[#E2E8F0]'
                }`}>
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{item.name}</p>
                        <p className={`text-[11px] ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                          Qty: {item.quantity} | Size: {item.size} | Color: {item.color}
                        </p>
                      </div>
                      <span className={`font-bold ${isDark ? 'text-[#10D990]' : 'text-[#10B981]'}`}>
                        NPR {item.total?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Control */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-[#101D32] border-[#1E304A]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
              }`}>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Update Status</p>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className={`flex-1 rounded-xl p-2.5 font-bold outline-none border transition-all ${
                      isDark ? 'bg-[#0D192D] border-[#1E304A] text-white' : 'bg-white border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    {['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, newStatus)}
                    disabled={updating}
                    className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
                      isDark ? 'bg-[#10D990] text-[#050B18] hover:bg-[#0EB87B]' : 'bg-[#10B981] text-white hover:bg-[#059669]'
                    }`}
                  >
                    {updating ? 'Updating...' : 'Save Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
