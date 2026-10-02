import React from 'react';
import Link from 'next/link';
import { Scissors, GraduationCap, Factory, Truck, Award } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900">Garment Services</h1>
        <p className="text-sm text-slate-600">Manufacturing, Custom Tailoring, Uniform Supply & Wholesale Distribution.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-card space-y-3">
          <Scissors className="w-8 h-8 text-brand-800" />
          <h3 className="font-serif font-bold text-slate-900 text-lg">Bespoke Custom Stitching</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tailor-made ladies kurthas, gowns, wedding wear, and custom fitted suits with your choice of fabric and embroidery patterns.
          </p>
          <Link href="/custom-stitching" className="text-xs font-bold text-brand-800 hover:underline block pt-2">
            Request Stitching Quote →
          </Link>
        </div>

        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-card space-y-3">
          <GraduationCap className="w-8 h-8 text-brand-800" />
          <h3 className="font-serif font-bold text-slate-900 text-lg">School Uniform Contracts</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Complete institutional uniform manufacturing including shirts, trousers, skirts, tracksuits, house dresses, and embroidered logo patches.
          </p>
          <Link href="/school-uniform" className="text-xs font-bold text-brand-800 hover:underline block pt-2">
            School Uniform Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
