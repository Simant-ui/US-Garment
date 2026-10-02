'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Package, Truck, MessageCircle, FileText } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';

export default function OrderSuccessPageClient({ order }: { order: any }) {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-card text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-slate-900">
          {t('systemMessages.orderPlaced')}
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Ref Number:{' '}
          <strong className="text-[#0F4C3A] font-mono text-base">{order.orderNumber}</strong>.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Namaste!%20I%20placed%20order%20${order.orderNumber}.%20Please%20confirm%20delivery%20status.`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md"
          >
            <MessageCircle className="w-4 h-4" /> {t('topBar.whatsappUs')}
          </a>
          <Link
            href="/shop"
            className="px-6 py-3 bg-[#0F4C3A] hover:bg-[#0B3B2D] text-white font-bold rounded-xl text-xs flex items-center gap-2"
          >
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-4 h-4 text-[#0F4C3A]" /> {t('checkout.shippingAddress')}
          </h3>
          <div className="text-xs text-slate-700 space-y-1">
            <p className="font-bold text-sm text-slate-900">{order.shippingAddress.fullName}</p>
            <p>{t('checkout.phone')}: {order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.addressLine}, {order.shippingAddress.city}</p>
            <p>{order.shippingAddress.district}, {order.shippingAddress.province}, Nepal</p>
            {order.shippingAddress.landmark && <p className="text-slate-500">{t('checkout.landmark')}: {order.shippingAddress.landmark}</p>}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-[#0F4C3A]" /> {t('checkout.paymentMethod')}
          </h3>
          <div className="text-xs text-slate-700 space-y-1">
            <p>{t('checkout.paymentMethod')}: <strong className="text-slate-900">{order.paymentMethod}</strong></p>
            <p>Payment Status: <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">{order.paymentStatus}</span></p>
            <p>Order Status: <span className="px-2 py-0.5 rounded bg-[#E6F4EE] text-[#0F4C3A] font-bold text-[10px]">{order.status}</span></p>
            <p className="text-sm font-bold text-slate-900 pt-2">{t('checkout.orderTotal')}: {t('common.rs')} {order.totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Ordered Garment Items */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <Package className="w-4 h-4 text-[#0F4C3A]" /> {t('shop.products')}
        </h3>

        <div className="divide-y divide-slate-100">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.name}</p>
                  <p className="text-[11px] text-slate-500">{t('shop.quantity')}: {item.quantity} | {t('shop.size')}: {item.size}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {t('common.rs')} {item.total?.toLocaleString() || (item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
