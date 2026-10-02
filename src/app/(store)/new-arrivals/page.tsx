import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export default async function NewArrivalsPage() {
  await connectDB();
  const products = await Product.find({ isNewArrival: true, status: 'PUBLISHED' }).populate('category', 'name slug').lean();
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="categories.new-arrivals"
      fallbackTitle="New Arrivals"
      products={serialize(products)}
    />
  );
}
