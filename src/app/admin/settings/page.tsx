'use client';

import React, { useEffect, useState } from 'react';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';
import { useAdminTheme } from '@/context/ThemeContext';

export default function AdminSettingsPage() {
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [settings, setSettings] = useState<any>({
    businessName: 'US Dresses and Garment Udyog',
    phone: '+977 9855012345',
    secondaryPhone: '+977 057 523456',
    whatsapp: '+9779855012345',
    email: 'info@usdresses.com.np',
    address: 'Hetauda-04, Main Road, Makwanpur, Nepal',
    shippingCharge: 150,
    freeShippingThreshold: 3000,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) setSettings(data.settings);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          shippingCharge: Number(settings.shippingCharge),
          freeShippingThreshold: Number(settings.freeShippingThreshold),
        }),
      });

      if (res.ok) setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      <div>
        <h1 className={`text-2xl md:text-3xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          Store & Business Settings
        </h1>
        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          Manage contact numbers, Hetauda address, WhatsApp links, and delivery rates for US Dresses Udyog.
        </p>
      </div>

      {saved && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 font-semibold ${
          isDark ? 'bg-[#064E3B]/40 border-[#064E3B] text-[#10D990]' : 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]'
        }`}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Business settings saved successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className={`p-6 rounded-2xl border space-y-4 text-xs transition-colors ${
          isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0] shadow-xs'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Business Name *
            </label>
            <input
              type="text"
              name="businessName"
              required
              value={settings.businessName}
              onChange={handleChange}
              className={`w-full rounded-xl p-3 text-xs font-bold border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Primary Phone *
            </label>
            <input
              type="text"
              name="phone"
              required
              value={settings.phone}
              onChange={handleChange}
              className={`w-full rounded-xl p-3 text-xs font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              WhatsApp Number *
            </label>
            <input
              type="text"
              name="whatsapp"
              required
              value={settings.whatsapp}
              onChange={handleChange}
              className={`w-full rounded-xl p-3 text-xs font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Official Email *
            </label>
            <input
              type="email"
              name="email"
              required
              value={settings.email}
              onChange={handleChange}
              className={`w-full rounded-xl p-3 text-xs font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Store & Factory Address *
            </label>
            <input
              type="text"
              name="address"
              required
              value={settings.address}
              onChange={handleChange}
              className={`w-full rounded-xl p-3 text-xs font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Standard Shipping Fee (NPR) *
            </label>
            <input
              type="number"
              name="shippingCharge"
              required
              value={settings.shippingCharge}
              onChange={handleChange}
              className={`w-full rounded-xl p-3 text-xs font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>

          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Free Shipping Threshold (NPR) *
            </label>
            <input
              type="number"
              name="freeShippingThreshold"
              required
              value={settings.freeShippingThreshold}
              onChange={handleChange}
              className={`w-full rounded-xl p-3 text-xs font-medium border outline-none transition-all ${
                isDark
                  ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
              }`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-3 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all ${
            isDark ? 'bg-[#10D990] text-[#050B18] hover:bg-[#0EB87B]' : 'bg-[#10B981] text-white hover:bg-[#059669]'
          }`}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Settings
        </button>
      </form>
    </div>
  );
}
