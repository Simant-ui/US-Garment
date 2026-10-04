import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function WomenPage() {
  const db = await connectDB();
  let products: any[] = [];
  if (db) {
    try {
      products = await Product.find({
        $or: [{ tags: 'Ladies Wear' }, { tags: 'Kurtha' }, { tags: 'Gown' }],
        status: 'PUBLISHED',
      }).populate('category', 'name slug').lean();
    } catch (e) {
      console.warn('Failed to load women collection:', e);
    }
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="nav.women"
      fallbackTitle="Women's Collection"
      products={serialize(products)}
    />
  );
}
