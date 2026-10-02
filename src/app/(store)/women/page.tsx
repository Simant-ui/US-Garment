import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export default async function WomenPage() {
  await connectDB();
  const products = await Product.find({
    $or: [{ tags: 'Ladies Wear' }, { tags: 'Kurtha' }, { tags: 'Gown' }],
    status: 'PUBLISHED',
  }).populate('category', 'name slug').lean();

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="nav.women"
      fallbackTitle="Women's Collection"
      products={serialize(products)}
    />
  );
}
