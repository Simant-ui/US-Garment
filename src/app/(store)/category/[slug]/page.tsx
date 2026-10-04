import React from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function DynamicCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const db = await connectDB();

  let category: any = null;
  let products: any[] = [];

  if (db) {
    try {
      category = await Category.findOne({ slug, isActive: true }).lean();
      if (category) {
        products = await Product.find({ category: category._id, status: 'PUBLISHED' })
          .populate('category', 'name slug')
          .sort({ createdAt: -1 })
          .lean();
      }
    } catch (e) {
      console.warn(`Failed to load category ${slug}:`, e);
    }
  }

  if (!category) {
    notFound();
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      fallbackTitle={serialize(category.name)}
      fallbackSubtitle={category.description ? serialize(category.description) : undefined}
      products={serialize(products)}
    />
  );
}
