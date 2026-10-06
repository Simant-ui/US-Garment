import React from 'react';
import prisma from '@/lib/prisma';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

export const revalidate = 60;

export default async function WomenPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { category: { slug: 'ladies-kurtha' } },
          { category: { slug: 'ladies-gown' } },
          { name: { contains: 'Ladies' } },
          { name: { contains: 'Kurtha' } },
        ],
      },
      include: { category: { select: { name: true, slug: true } } },
    });
  } catch (e) {
    console.warn('Failed to load women collection:', e);
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      titleKey="nav.women"
      fallbackTitle="Women's Collection"
      products={serialize(products)}
    />
  );
}
