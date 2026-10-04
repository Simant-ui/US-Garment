import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function NewArrivalsPage() {
  const db = await connectDB();
  let products: any[] = [];
  if (db) {
    try {
      products = await Product.find({ isNewArrival: true, status: 'PUBLISHED' }).populate('category', 'name slug').lean();
    } catch (e) {
      console.warn('Failed to load new arrivals:', e);
    }
  }
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="categories.new-arrivals"
      fallbackTitle="New Arrivals"
      products={serialize(products)}
    />
  );
}
