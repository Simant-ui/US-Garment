import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import SearchPageClient from './SearchPageClient';

interface SearchProps {
  searchParams: Promise<{ q?: string }>;
}

export const revalidate = 60;

export default async function SearchPage({ searchParams }: SearchProps) {
  const { q } = await searchParams;
  const queryText = q?.trim() || '';

  const db = await connectDB();

  let products: any[] = [];
  let matchingCategories: any[] = [];

  if (db && queryText) {
    try {
      const regex = new RegExp(queryText, 'i');
      [products, matchingCategories] = await Promise.all([
        Product.find({
          $or: [
            { name: regex },
            { description: regex },
            { tags: regex },
            { sku: regex },
          ],
          status: 'PUBLISHED',
        })
          .populate('category', 'name slug')
          .lean(),
        Category.find({
          name: regex,
          isActive: true,
        }).lean(),
      ]);
    } catch (e) {
      console.warn('Failed to search products:', e);
    }
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
