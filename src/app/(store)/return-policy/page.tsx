import React from 'react';

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
      <h1 className="text-3xl font-serif font-bold text-slate-900">Return & Exchange Policy</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed space-y-4">
        <p>We take immense pride in the craftsmanship of US Dresses & Garment Udyog. If you are not satisfied with your garment size or received a defective item, we offer hassle-free exchanges.</p>
        <h3 className="font-bold text-slate-900 text-base">Exchange Terms</h3>
        <p>• Returns/Exchanges must be initiated within 7 days of receiving your package.</p>
        <p>• Garments must be unworn, unwashed, and have original tags attached.</p>
        <p>• Custom tailored stitched outfits are non-returnable unless there is a manufacturing defect.</p>
      </div>
    </div>
  );
}
