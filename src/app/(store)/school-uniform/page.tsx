import React from 'react';
import prisma from '@/lib/prisma';
import SchoolUniformPageClient from './SchoolUniformPageClient';

export const revalidate = 60;

export default async function SchoolUniformPage() {
  let uniformProducts: any[] = [];
  try {
    uniformProducts = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { category: { slug: 'school-uniform' } },
          { name: { contains: 'Uniform' } },
        ],
      },
      take: 8,
    });
  } catch (e) {
    console.warn('Failed to load school uniform products:', e);
  }
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return <SchoolUniformPageClient uniformProducts={serialize(uniformProducts)} />;
}
