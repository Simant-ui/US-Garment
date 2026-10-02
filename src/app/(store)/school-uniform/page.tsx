import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import SchoolUniformPageClient from './SchoolUniformPageClient';

export default async function SchoolUniformPage() {
  await connectDB();
  const uniformProducts = await Product.find({ tags: 'School Uniform', status: 'PUBLISHED' }).limit(8).lean();
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return <SchoolUniformPageClient uniformProducts={serialize(uniformProducts)} />;
}
