import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export default async function BestSellersPage() {
  await connectDB();
  const products = await Product.find({ isBestSeller: true, status: 'PUBLISHED' }).populate('category', 'name slug').lean();
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="categories.best-sellers"
      fallbackTitle="Best Sellers"
      products={serialize(products)}
    />
  );
}
