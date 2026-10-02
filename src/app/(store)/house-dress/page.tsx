import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export default async function HouseDressPage() {
  await connectDB();
  const houseDressProducts = await Product.find({
    $or: [{ tags: 'House Dress' }, { categorySlug: 'house-dress' }],
    status: 'PUBLISHED',
  }).limit(12).lean();

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="nav.houseDress"
      fallbackTitle="House Dress"
      products={serialize(houseDressProducts)}
    />
  );
}
