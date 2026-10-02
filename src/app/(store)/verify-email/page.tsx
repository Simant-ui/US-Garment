'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MailCheck, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 60-second cooldown timer
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Mask email format: us***@gmail.com
  const maskEmail = (str: string) => {
    if (!str) return 'your email';
    const parts = str.split('@');
    if (parts.length !== 2) return str;
    const [user, domain] = parts;
    if (user.length <= 2) return `${user}***@${domain}`;
    return `${user.slice(0, 2)}***@${domain}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrorMsg('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split('');
    setOtp(digits);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg(t('emailOtp.invalidCode'));
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: fullOtp }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t('emailOtp.invalidCode'));
      }

      setSuccessMsg(t('emailOtp.verifiedSuccess'));
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || t('emailOtp.invalidCode'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || resending) return;

    setResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/resend-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t('systemMessages.somethingWentWrong'));
      }

      setSuccessMsg(data.message || 'Code sent');
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMsg(err.message || t('systemMessages.somethingWentWrong'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-card border border-slate-100 space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#0F4C3A] text-white flex items-center justify-center mx-auto shadow-md">
          <MailCheck className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">{t('emailOtp.verifyTitle')}</h1>
          <p className="text-xs text-slate-500 mt-1.5">
            {t('emailOtp.verifySubtitle')} <span className="font-bold text-slate-800">{maskEmail(email)}</span>
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 outline-none transition-all shadow-xs"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-3.5 bg-[#0F4C3A] hover:bg-[#0B3B2D] disabled:opacity-60 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('emailOtp.verifyButton')}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-2">
          <p>{t('emailOtp.didntReceive')}</p>
          {canResend ? (
            <button
              onClick={handleResendCode}
              disabled={resending}
              className="text-[#0F4C3A] font-bold hover:underline inline-flex items-center gap-1"
            >
              {resending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t('emailOtp.resendCode')}
            </button>
          ) : (
            <p className="text-slate-400 font-medium">{t('emailOtp.expiresIn')}: {timer}s</p>
          )}
        </div>

        <div className="pt-2">
          <Link href="/register" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> {t('common.back')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-xs text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#0F4C3A]" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
