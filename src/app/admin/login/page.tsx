'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAdminTheme } from '@/context/ThemeContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Admin authentication failed');
      }

      login(data.token, data.user);
      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md p-8 rounded-3xl shadow-xl space-y-6 border transition-colors font-sans ${
      isDark ? 'bg-[#0D192D] border-[#1E304A]' : 'bg-white border-[#E2E8F0]'
    }`}>
      <div className="text-center space-y-2">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-md ${
          isDark ? 'bg-[#10D990] text-[#050B18]' : 'bg-[#10B981] text-white'
        }`}>
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className={`text-2xl font-serif font-bold ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
          US Garment Admin
        </h1>
        <p className={`text-xs font-medium ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
          Enter authorized administrator credentials to manage inventory & orders.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className={`block font-semibold uppercase mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Admin Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@usdresses.com.np"
            className={`w-full rounded-xl px-4 py-3 text-xs font-medium border outline-none transition-all ${
              isDark
                ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
            }`}
          />
        </div>

        <div>
          <label className={`block font-semibold uppercase mb-1.5 ${isDark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            Admin Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`w-full rounded-xl px-4 py-3 text-xs font-medium border outline-none transition-all ${
              isDark
                ? 'bg-[#101D32] border-[#1E304A] text-white focus:ring-2 focus:ring-[#10D990]'
                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] focus:ring-2 focus:ring-[#10B981]'
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs ${
            isDark ? 'bg-[#10D990] text-[#050B18] hover:bg-[#0EB87B]' : 'bg-[#10B981] text-white hover:bg-[#059669]'
          }`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate Admin Portal'}
        </button>
      </form>
    </div>
  );
}
