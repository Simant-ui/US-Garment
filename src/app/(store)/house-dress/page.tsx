import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function HouseDressPage() {
  const db = await connectDB();
  let houseDressProducts: any[] = [];
  if (db) {
    try {
      houseDressProducts = await Product.find({
        $or: [{ tags: 'House Dress' }, { categorySlug: 'house-dress' }],
        status: 'PUBLISHED',
      }).limit(12).lean();
    } catch (e) {
      console.warn('Failed to load house dress products:', e);
    }
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="nav.houseDress"
      fallbackTitle="House Dress"
      products={serialize(houseDressProducts)}
    />
  );
}
