'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Namaste!%20I%20am%20interested%20in%20ordering%20garments%20from%20US%20Dresses%20and%20Garment%20Udyog.`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with US Dresses on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group cursor-pointer border-2 border-white"
    >
      <MessageCircle className="w-6 h-6 animate-pulse" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-bold pr-1">
        WhatsApp Order / Inquiry
      </span>
    </a>
  );
}
