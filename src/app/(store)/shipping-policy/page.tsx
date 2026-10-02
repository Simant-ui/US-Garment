import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
      <h1 className="text-3xl font-serif font-bold text-slate-900">Shipping & Delivery Policy</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed space-y-4">
        <p>US Dresses and Garment Udyog ships garments to all major cities and rural districts across Nepal.</p>
        <h3 className="font-bold text-slate-900 text-base">Standard Shipping Rates</h3>
        <p>• Standard Delivery Fee: NPR 150 for orders below NPR 3,000.</p>
        <p>• FREE Shipping: Applied automatically on all orders NPR 3,000 and above.</p>
        <h3 className="font-bold text-slate-900 text-base">Delivery Timeline</h3>
        <p>• Hetauda & Makwanpur: 1 - 2 business days.</p>
        <p>• Kathmandu Valley & Chitwan: 2 - 3 business days.</p>
        <p>• Other Nepal Districts: 3 - 5 business days.</p>
      </div>
    </div>
  );
}
