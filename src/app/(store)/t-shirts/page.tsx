import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export default async function TShirtsPage() {
  await connectDB();
  const products = await Product.find({
    $or: [{ tags: 'T-Shirt' }, { tags: 'Unisex' }, { categorySlug: 't-shirts' }],
    status: 'PUBLISHED',
  }).populate('category', 'name slug').lean();

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="nav.tShirts"
      fallbackTitle="T-Shirts"
      products={serialize(products)}
    />
  );
}
