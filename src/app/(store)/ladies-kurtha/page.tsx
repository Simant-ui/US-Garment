import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export default async function LadiesKurthaPage() {
  await connectDB();
  const products = await Product.find({
    $or: [{ tags: 'Kurtha' }, { subCategory: 'Ladies Kurtha' }, { categorySlug: 'ladies-kurtha' }],
    status: 'PUBLISHED',
  })
    .populate('category', 'name slug')
    .lean();

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="categories.ladies-kurtha"
      fallbackTitle="Ladies Kurtha Collection"
      products={serialize(products)}
    />
  );
}
