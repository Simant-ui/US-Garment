'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0F4C3A]" />
        <p className="text-xs">{t('common.loading')}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center space-y-3 font-sans">
        <Package className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="text-sm font-semibold text-slate-700">{t('account.noOrders')}</p>
        <Link href="/shop" className="text-xs text-[#0F4C3A] font-bold hover:underline">
          {t('cart.startShopping')} →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <h2 className="text-xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">
        {t('account.orderHistory')} ({orders.length})
      </h2>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusKey = order.status ? `orderStatus.${order.status}` : 'orderStatus.PENDING';
          const statusText = t(statusKey, undefined);

          return (
            <div key={order._id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex flex-wrap justify-between items-center text-xs gap-2 border-b border-slate-100 pb-2">
                <span className="font-mono font-bold text-slate-900">Order #{order.orderNumber}</span>
                <span className="text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4EE] text-[#0F4C3A] font-extrabold">
                  {statusText !== statusKey ? statusText : order.status}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <p className="text-slate-600">{order.items?.length || 0} {t('cart.product')}</p>
                <p className="font-bold text-slate-900 text-sm">{t('common.rs')} {order.totalAmount?.toLocaleString()}</p>
              </div>

              <Link
                href={`/order-success/${order.id || order.orderNumber || order._id}`}
                className="inline-block text-xs font-bold text-[#0F4C3A] hover:underline"
              >
                {t('account.viewDetails')} →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
