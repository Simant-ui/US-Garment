import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function LadiesKurthaPage() {
  const db = await connectDB();
  let products: any[] = [];
  if (db) {
    try {
      products = await Product.find({
        $or: [{ tags: 'Kurtha' }, { subCategory: 'Ladies Kurtha' }, { categorySlug: 'ladies-kurtha' }],
        status: 'PUBLISHED',
      })
        .populate('category', 'name slug')
        .lean();
    } catch (e) {
      console.warn('Failed to load ladies kurtha products:', e);
    }
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="categories.ladies-kurtha"
      fallbackTitle="Ladies Kurtha Collection"
      products={serialize(products)}
    />
  );
}
