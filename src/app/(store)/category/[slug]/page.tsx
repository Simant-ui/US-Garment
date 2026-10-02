import React from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  await connectDB();

  const category = await Category.findOne({ slug, isActive: true }).lean();
  if (!category) {
    notFound();
  }

  const products = await Product.find({ category: category._id, status: 'PUBLISHED' })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .lean();

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      fallbackTitle={serialize(category.name)}
      fallbackSubtitle={category.description ? serialize(category.description) : undefined}
      products={serialize(products)}
    />
  );
}
