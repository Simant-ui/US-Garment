import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function TShirtsPage() {
  const db = await connectDB();
  let products: any[] = [];
  if (db) {
    try {
      products = await Product.find({
        $or: [{ tags: 'T-Shirt' }, { tags: 'Unisex' }, { categorySlug: 't-shirts' }],
        status: 'PUBLISHED',
      }).populate('category', 'name slug').lean();
    } catch (e) {
      console.warn('Failed to load t-shirts products:', e);
    }
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="nav.tShirts"
      fallbackTitle="T-Shirts"
      products={serialize(products)}
    />
  );
}
