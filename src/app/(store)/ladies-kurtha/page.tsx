import React from 'react';
import prisma from '@/lib/prisma';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function LadiesKurthaPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { category: { slug: 'ladies-kurtha' } },
          { name: { contains: 'Kurtha' } },
        ],
      },
      include: { category: { select: { name: true, slug: true } } },
    });
  } catch (e) {
    console.warn('Failed to load ladies kurtha products:', e);
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="categories.ladies-kurtha"
      fallbackTitle="Ladies Kurtha Collection"
      products={serialize(products)}
    />
  );
}
