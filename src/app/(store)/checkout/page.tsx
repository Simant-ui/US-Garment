'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldCheck, Truck, CreditCard, Banknote, Building2, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { NEPAL_PROVINCES, NEPAL_DISTRICTS } from '@/lib/constants';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discount, shippingFee, total, couponCode, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone || '' : '',
    province: 'Bagmati Province',
    district: 'Makwanpur',
    city: 'Hetauda',
    addressLine: 'Main Road, Hetauda-04',
    landmark: 'Near Garment Factory',
    paymentMethod: 'COD',
    orderNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const availableDistricts = NEPAL_DISTRICTS[formData.province] || NEPAL_DISTRICTS['Bagmati Province'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'province') {
      const districts = NEPAL_DISTRICTS[value] || [];
      setFormData({
        ...formData,
        province: value,
        district: districts[0] || '',
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg(t('cart.emptyCartMsg'));
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            province: formData.province,
            district: formData.district,
            city: formData.city,
            addressLine: formData.addressLine,
            landmark: formData.landmark,
          },
          paymentMethod: formData.paymentMethod,
          couponCode,
          orderNotes: formData.orderNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t('systemMessages.somethingWentWrong'));
      }

      clearCart();
      const targetOrderId = data.order?.id || data.order?.orderNumber || data.order?._id;
      router.push(`/order-success/${targetOrderId}`);
    } catch (err: any) {
      setErrorMsg(err.message || t('systemMessages.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center font-sans">
        <p className="text-base text-slate-600">{t('cart.emptyCartMsg')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 font-sans">
      <h1 className="text-3xl font-serif font-bold text-slate-900">{t('checkout.checkout')}</h1>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Box */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="w-5 h-5 text-[#0F4C3A]" /> {t('checkout.shippingAddress')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">{t('checkout.fullName')} *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ram Shrestha"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0F4C3A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">{t('checkout.phone')} *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9845012345"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0F4C3A] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">{t('auth.email')} *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0F4C3A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">{t('checkout.province')} *</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0F4C3A] outline-none"
                >
                  {NEPAL_PROVINCES.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">{t('checkout.district')} *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0F4C3A] outline-none"
                >
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">{t('checkout.municipality')} *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Hetauda / Kathmandu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0F4C3A] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">{t('checkout.street')} *</label>
                <input
                  type="text"
                  name="addressLine"
                  required
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="Street / Ward No / Tole"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0F4C3A] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-[#0F4C3A]" /> {t('checkout.paymentMethod')}
            </h3>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'COD' ? 'border-[#0F4C3A] bg-[#E6F4EE]/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#0F4C3A]"
                />
                <Banknote className="w-6 h-6 text-[#0F4C3A] flex-shrink-0" />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">{t('checkout.cod')}</span>
                  <span className="text-xs text-slate-500">Pay cash upon delivery.</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'BANK_TRANSFER' ? 'border-[#0F4C3A] bg-[#E6F4EE]/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={formData.paymentMethod === 'BANK_TRANSFER'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#0F4C3A]"
                />
                <Building2 className="w-6 h-6 text-emerald-700 flex-shrink-0" />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">{t('checkout.bankTransfer')}</span>
                  <span className="text-xs text-slate-500">Direct deposit to Nepal Investment Bank.</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'ONLINE_GATEWAY' ? 'border-[#0F4C3A] bg-[#E6F4EE]/50 shadow-sm' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE_GATEWAY"
                  checked={formData.paymentMethod === 'ONLINE_GATEWAY'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#0F4C3A]"
                />
                <CreditCard className="w-6 h-6 text-purple-700 flex-shrink-0" />
                <div>
                  <span className="font-bold text-sm text-slate-900 block">{t('checkout.esewa')}</span>
                  <span className="text-xs text-slate-500">Instant digital wallet payment.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Review */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <h3 className="font-serif font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
              {t('cart.orderSummary')} ({cart.length})
            </h3>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-slate-500">{t('shop.quantity')}: {item.quantity} | {t('shop.size')}: {item.size}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {t('common.rs')} {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span className="font-bold text-slate-900">{t('common.rs')} {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t('cart.discount')}</span>
                  <span>- {t('common.rs')} {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span className="font-bold text-slate-900">{shippingFee === 0 ? 'FREE' : `${t('common.rs')} ${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-3">
                <span>{t('checkout.orderTotal')}</span>
                <span className="text-[#0F4C3A]">{t('common.rs')} {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0F4C3A] hover:bg-[#0B3B2D] text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-base"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('checkout.placeOrder')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
