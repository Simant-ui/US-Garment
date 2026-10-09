'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function FAQPageClient() {
  const { t, language } = useLanguage();

  const faqsEn = [
    { q: "Where is US Dresses and Garment Udyog located?", a: "Our main office, factory, and showroom are located in Hetauda-04, Makwanpur, Bagmati Province, Nepal." },
    { q: "Do you deliver all over Nepal?", a: "Yes! We ship to all 77 districts in Nepal. Orders over NPR 3,000 qualify for free standard delivery." },
    { q: "How do I place a bulk school uniform order?", a: "Visit our Wholesale page or School Uniform page and submit your quantity requirements. Our procurement officer will contact you within 24 hours." },
    { q: "Can I get custom tailoring for individual outfits?", a: "Absolutely. Use our Custom Stitching page to specify measurements, design requirements, and upload reference photos." },
    { q: "What payment methods are supported?", a: "We support Cash on Delivery (COD), Direct Bank Transfer, and digital online payments." }
  ];

  const faqsNe = [
    { q: "यूएस ड्रेसेस एण्ड गार्मेन्ट उद्योग कहाँ अवस्थित छ?", a: "हाम्रो मुख्य कार्यालय, कारखाना र शोरुम हेटौंडा-४, मकवानपुर, बागमती प्रदेश, नेपालमा अवस्थित छ।" },
    { q: "के नेपालभरि डेलिभरी सेवा उपलब्ध छ?", a: "हो! हामी नेपालका सम्पूर्ण ७७ जिल्लामा कपडा डेलिभरी गर्छौँ। रु. ३,००० भन्दा माथिको अर्डरमा नि:शुल्क डेलिभरी उपलब्ध छ।" },
    { q: "विद्यालय युनिफर्मको थोक अर्डर कसरी दिने?", a: "हाम्रो थोक बिक्री (Wholesale) वा स्कुल हाउस ड्रेस पृष्ठमा गई परिमाण र विवरण पेश गर्नुहोस्। हाम्रो टोलीले २४ घण्टाभित्र सम्पर्क गर्नेछ।" },
    { q: "के व्यक्तिगत कपडा सिलाइ (Custom Tailoring) सम्भव छ?", a: "अवश्य पनि! कस्टम सिलाइ पृष्ठमा गई तपाईंको नाप, कपडाको रोजाइ र नमुना तस्बिर पठाउन सक्नुहुन्छ।" },
    { q: "भुक्तानीका कस्ता विधिहरू उपलब्ध छन्?", a: "हामी डेलिभरीमा नगद भुक्तानी (COD), बैंक ट्रान्सफर र ईसेवा / खल्ती डिजिटल भुक्तानी स्वीकार गर्छौँ।" }
  ];

  const currentFaqs = language === 'ne' ? faqsNe : faqsEn;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 font-sans">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-slate-900">{t('pages.faq.title')}</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">{t('pages.faq.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {currentFaqs.map((f, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 text-base">{f.q}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
