import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function BestSellersPage() {
  const db = await connectDB();
  let products: any[] = [];
  if (db) {
    try {
      products = await Product.find({ isBestSeller: true, status: 'PUBLISHED' }).populate('category', 'name slug').lean();
    } catch (e) {
      console.warn('Failed to load best-sellers products:', e);
    }
  }
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="categories.best-sellers"
      fallbackTitle="Best Sellers"
      products={serialize(products)}
    />
  );
}
