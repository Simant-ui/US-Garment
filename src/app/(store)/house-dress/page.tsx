import React from 'react';
import prisma from '@/lib/prisma';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function HouseDressPage() {
  let houseDressProducts: any[] = [];
  try {
    houseDressProducts = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { category: { slug: 'house-dress' } },
          { name: { contains: 'House Dress' } },
        ],
      },
      take: 12,
    });
  } catch (e) {
    console.warn('Failed to load house dress products:', e);
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="nav.houseDress"
      fallbackTitle="House Dress"
      products={serialize(houseDressProducts)}
    />
  );
}
