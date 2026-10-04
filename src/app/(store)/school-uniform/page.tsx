import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import SchoolUniformPageClient from './SchoolUniformPageClient';

export const revalidate = 60;

export default async function SchoolUniformPage() {
  const db = await connectDB();
  let uniformProducts: any[] = [];
  if (db) {
    try {
      uniformProducts = await Product.find({ tags: 'School Uniform', status: 'PUBLISHED' }).limit(8).lean();
    } catch (e) {
      console.warn('Failed to load school uniform products:', e);
    }
  }
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return <SchoolUniformPageClient uniformProducts={serialize(uniformProducts)} />;
}
