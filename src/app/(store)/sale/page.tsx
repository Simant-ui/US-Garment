import React from 'react';
import prisma from '@/lib/prisma';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function SalePage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: { isOnSale: true, status: 'PUBLISHED' },
      include: { category: { select: { name: true, slug: true } } },
    });
  } catch (e) {
    console.warn('Failed to load sale products:', e);
  }
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="categories.sale"
      fallbackTitle="Sale"
      products={serialize(products)}
    />
  );
}
