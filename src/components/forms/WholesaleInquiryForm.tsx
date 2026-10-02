'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WholesaleInquiryForm() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    phone: '',
    email: '',
    productType: 'School Uniform Bulk',
    estimatedQuantity: 100,
    budgetRange: 'NPR 100,000 - 300,000',
    requiredDate: '',
    location: 'Hetauda, Nepal',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedQuantity: Number(formData.estimatedQuantity),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t('systemMessages.somethingWentWrong'));
      }

      setSuccessMsg(t('wholesale.successDesc'));
      setFormData({
        organizationName: '',
        contactPerson: '',
        phone: '',
        email: '',
        productType: 'School Uniform Bulk',
        estimatedQuantity: 100,
        budgetRange: '',
        requiredDate: '',
        location: '',
        description: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || t('systemMessages.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-3xl shadow-card border border-slate-100 space-y-6 font-sans">
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p>{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('wholesale.businessName')} *</label>
          <input
            type="text"
            name="organizationName"
            required
            value={formData.organizationName}
            onChange={handleChange}
            placeholder="e.g. Hetauda Secondary School"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('wholesale.contactPerson')} *</label>
          <input
            type="text"
            name="contactPerson"
            required
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="e.g. Ram Bahadur"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('wholesale.phone')} *</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 9855012345"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('wholesale.email')} *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="info@organization.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('wholesale.garmentCategory')} *</label>
          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          >
            <option value="School Uniform Bulk">{t('nav.schoolUniform')}</option>
            <option value="House Dress Bulk">{t('nav.houseDress')}</option>
            <option value="T-Shirts Bulk">{t('nav.tShirts')}</option>
            <option value="Tracksuits Bulk">{t('nav.trackSuits')}</option>
            <option value="Ladies Wholesale">{t('nav.women')}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('wholesale.requiredQuantity')} *</label>
          <input
            type="number"
            name="estimatedQuantity"
            min="10"
            required
            value={formData.estimatedQuantity}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('wholesale.message')} *</label>
        <textarea
          name="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed requirements..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#0F4C3A] hover:bg-[#0B3B2D] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('wholesale.requestQuote')}
      </button>
    </form>
  );
}
