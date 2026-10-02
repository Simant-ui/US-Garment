import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import SearchPageClient from './SearchPageClient';

interface SearchProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchProps) {
  const { q } = await searchParams;
  const queryText = q?.trim() || '';

  await connectDB();

  let products: any[] = [];
  let matchingCategories: any[] = [];

  if (queryText) {
    const regex = new RegExp(queryText, 'i');
    products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { tags: regex },
        { sku: regex },
      ],
      status: 'PUBLISHED',
    })
      .populate('category', 'name slug')
      .lean();

    matchingCategories = await Category.find({
      name: regex,
      isActive: true,
    }).lean();
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <SearchPageClient
      queryText={queryText}
      products={serialize(products)}
      matchingCategories={serialize(matchingCategories)}
    />
  );
}
