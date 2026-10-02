'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Bookmark, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CartPage() {
  const {
    cart,
    savedForLater,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    subtotal,
    discount,
    shippingFee,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { t } = useLanguage();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6 font-sans">
        <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">{t('cart.emptyCart')}</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {t('cart.emptyCartMsg')}
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F4C3A] hover:bg-[#0B3B2D] text-white font-bold rounded-2xl shadow-lg transition-all text-sm"
        >
          {t('cart.startShopping')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8 font-sans">
      <h1 className="text-3xl font-serif font-bold text-slate-900">
        {t('cart.shoppingCart')} ({cart.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card divide-y divide-slate-100 overflow-hidden">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                  <Link href={`/product/${item.slug}`} className="font-bold text-slate-900 text-base hover:text-[#0F4C3A] transition-colors">
                    {item.name}
                  </Link>
                  <div className="text-xs text-slate-500 flex flex-wrap justify-center sm:justify-start gap-3">
                    <span>{t('shop.size')}: <strong className="text-slate-800">{item.size}</strong></span>
                    <span>{t('shop.color')}: <strong className="text-slate-800">{item.color}</strong></span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
                    <button
                      onClick={() => saveForLater(item.id)}
                      className="text-xs text-slate-500 hover:text-[#0F4C3A] flex items-center gap-1 font-semibold"
                    >
                      <Bookmark className="w-3.5 h-3.5" /> Save for Later
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> {t('cart.remove')}
                    </button>
                  </div>
                </div>

                {/* Quantity & Item Subtotal */}
                <div className="flex flex-col items-center sm:items-end gap-2">
                  <span className="text-base font-bold text-slate-900">
                    {t('common.rs')} {(item.price * item.quantity).toLocaleString()}
                  </span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Saved For Later Section */}
          {savedForLater.length > 0 && (
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Saved for Later ({savedForLater.length})</h3>
              <div className="divide-y divide-slate-200">
                {savedForLater.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-200">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.name}</p>
                        <p className="text-[11px] text-slate-500">{t('common.rs')} {item.price.toLocaleString()} | {t('shop.size')}: {item.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => moveToCart(item.id)}
                      className="px-3 py-1.5 bg-[#0F4C3A] text-white rounded-lg text-xs font-semibold hover:bg-[#0B3B2D]"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card space-y-6">
            <h3 className="font-serif font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
              {t('cart.orderSummary')}
            </h3>

            {/* Coupon Form */}
            <div>
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={t('cart.couponCode')}
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-[#0F4C3A] uppercase font-semibold"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  {t('cart.applyCoupon')}
                </button>
              </form>

              {couponSuccess && <p className="text-[11px] text-emerald-600 font-semibold mt-1.5">{couponSuccess}</p>}
              {couponError && <p className="text-[11px] text-rose-600 font-semibold mt-1.5">{couponError}</p>}

              {couponCode && (
                <div className="mt-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex justify-between items-center">
                  <span>Code Applied: <strong>{couponCode}</strong></span>
                  <button onClick={removeCoupon} className="text-rose-600 text-[10px] underline font-bold">{t('cart.remove')}</button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
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
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600">FREE Delivery</strong> : `${t('common.rs')} ${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-3">
                <span>{t('cart.total')}</span>
                <span className="text-[#0F4C3A]">{t('common.rs')} {total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-[#0F4C3A] hover:bg-[#0B3B2D] text-white font-bold rounded-2xl shadow-lg transition-all text-center block text-sm"
            >
              {t('cart.proceedToCheckout')} →
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('topBar.location')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
