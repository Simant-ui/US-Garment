import React from 'react';
import prisma from '@/lib/prisma';
import SearchPageClient from './SearchPageClient';

interface SearchProps {
  searchParams: Promise<{ q?: string }>;
}

export const revalidate = 60;

export default async function SearchPage({ searchParams }: SearchProps) {
  const { q } = await searchParams;
  const queryText = q?.trim() || '';

  let products: any[] = [];
  let matchingCategories: any[] = [];

  if (queryText) {
    try {
      [products, matchingCategories] = await Promise.all([
        prisma.product.findMany({
          where: {
            OR: [
              { name: { contains: queryText } },
              { description: { contains: queryText } },
              { sku: { contains: queryText } },
            ],
            status: 'PUBLISHED',
          },
          include: { category: { select: { name: true, slug: true } } },
        }),
        prisma.category.findMany({
          where: {
            name: { contains: queryText },
            isActive: true,
          },
        }),
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
