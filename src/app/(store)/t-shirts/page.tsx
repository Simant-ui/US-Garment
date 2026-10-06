import React from 'react';
import prisma from '@/lib/prisma';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function TShirtsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { category: { slug: 't-shirts' } },
          { name: { contains: 'T-Shirt' } },
        ],
      },
      include: { category: { select: { name: true, slug: true } } },
    });
  } catch (e) {
    console.warn('Failed to load t-shirts products:', e);
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="nav.tShirts"
      fallbackTitle="T-Shirts"
      products={serialize(products)}
    />
  );
}
