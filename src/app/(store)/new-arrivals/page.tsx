import React from 'react';
import prisma from '@/lib/prisma';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function NewArrivalsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isNewArrival: true, status: 'PUBLISHED' },
      include: { category: { select: { name: true, slug: true } } },
    });
  } catch (e) {
    console.warn('Failed to load new arrivals:', e);
  }
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="categories.new-arrivals"
      fallbackTitle="New Arrivals"
      products={serialize(products)}
    />
  );
}
