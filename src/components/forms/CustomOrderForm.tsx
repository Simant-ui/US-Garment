'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CustomOrderForm() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    garmentType: 'School Uniform',
    quantity: 50,
    size: 'Standard S-XXL',
    color: 'Navy Blue & White',
    fabricPreference: 'Cotton-Poly Blend',
    designRequirement: '',
    deliveryLocation: 'Hetauda, Nepal',
    requiredDate: '',
    additionalMessage: '',
  });

  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg('');
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 5 * 1024 * 1024) {
          setErrorMsg('Image size exceeds 5 MB limit. Please select a smaller image.');
          continue;
        }

        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, folder: 'custom_orders' }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          newUrls.push(data.url);
        } else if (data.error) {
          setErrorMsg(data.error);
        }
      }
      setReferenceImages((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      console.error('File upload failed:', err);
      setErrorMsg(err?.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
          referenceImages,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t('systemMessages.somethingWentWrong'));
      }

      setSuccessMsg(t('customTailoring.successDesc'));
      setFormData({
        fullName: '',
        mobileNumber: '',
        email: '',
        garmentType: 'School Uniform',
        quantity: 50,
        size: '',
        color: '',
        fabricPreference: '',
        designRequirement: '',
        deliveryLocation: '',
        requiredDate: '',
        additionalMessage: '',
      });
      setReferenceImages([]);
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
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('checkout.fullName')} *</label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Ram Shrestha"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('checkout.phone')} *</label>
          <input
            type="tel"
            name="mobileNumber"
            required
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="e.g. 9845012345"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('auth.email')} *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="ram@example.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('customTailoring.garmentType')} *</label>
          <select
            name="garmentType"
            value={formData.garmentType}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          >
            <option value="School Uniform">{t('nav.schoolUniform')}</option>
            <option value="House Dress">{t('nav.houseDress')}</option>
            <option value="Ladies Kurtha / Suit">Ladies Kurtha</option>
            <option value="Ladies Gown">Ladies Gown</option>
            <option value="T-Shirt / Polo">{t('nav.tShirts')}</option>
            <option value="Track Suit / Sportswear">{t('nav.trackSuits')}</option>
            <option value="Bulk Production">{t('wholesale.title')}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('wholesale.requiredQuantity')} *</label>
          <input
            type="number"
            name="quantity"
            min="1"
            required
            value={formData.quantity}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('checkout.shippingAddress')} *</label>
          <input
            type="text"
            name="deliveryLocation"
            required
            value={formData.deliveryLocation}
            onChange={handleChange}
            placeholder="e.g. Hetauda-04, Makwanpur"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('customTailoring.measurements')}</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="e.g. S, M, L or Chest 38, Waist 32"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('customTailoring.fabricPreference')}</label>
          <input
            type="text"
            name="fabricPreference"
            value={formData.fabricPreference}
            onChange={handleChange}
            placeholder="e.g. Cotton, Silk, Fleece"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('customTailoring.designDescription')} *</label>
        <textarea
          name="designRequirement"
          rows={4}
          required
          value={formData.designRequirement}
          onChange={handleChange}
          placeholder="Describe specifications, measurements, colors, style, etc."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#0F4C3A] focus:bg-white transition-all outline-none"
        ></textarea>
      </div>

      {/* Reference Image Upload */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">{t('customTailoring.uploadReference')}</label>
        <div className="border-2 border-dashed border-slate-200 hover:border-[#0F4C3A] rounded-2xl p-6 text-center bg-slate-50 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="custom-file-input"
          />
          <label htmlFor="custom-file-input" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-[#0F4C3A]" />
            <span className="text-sm font-semibold text-slate-700">{t('customTailoring.uploadReference')}</span>
            <span className="text-xs text-slate-400">JPG, PNG, WebP</span>
          </label>
          {uploading && <p className="text-xs text-[#0F4C3A] mt-2 font-medium">{t('common.loading')}</p>}
        </div>

        {referenceImages.length > 0 && (
          <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
            {referenceImages.map((url, i) => (
              <img key={i} src={url} alt="Uploaded sample" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#0F4C3A] hover:bg-[#0B3B2D] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('customTailoring.submitRequest')}
      </button>
    </form>
  );
}
