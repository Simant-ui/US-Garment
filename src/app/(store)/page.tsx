import React from 'react';
import prisma from '@/lib/prisma';
import HomePageClient from './HomePageClient';

export const revalidate = 60;

export default async function HomePage() {
  let newArrivals: any[] = [];
  let bestSellers: any[] = [];
  let schoolUniforms: any[] = [];
  let categories: any[] = [];

  try {
    [newArrivals, bestSellers, schoolUniforms, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isNewArrival: true, status: 'PUBLISHED' },
        include: { category: { select: { name: true, slug: true } } },
        take: 4,
      }),
      prisma.product.findMany({
        where: { isBestSeller: true, status: 'PUBLISHED' },
        include: { category: { select: { name: true, slug: true } } },
        take: 4,
      }),
      prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { tags: { equals: ['School Uniform'] } },
            { category: { slug: 'school-uniform' } },
          ],
        },
        include: { category: { select: { name: true, slug: true } } },
        take: 4,
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { orderIndex: 'asc' },
        take: 8,
      }),
    ]);
  } catch (e) {
    console.warn('Failed to load homepage products:', e);
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <HomePageClient
      newArrivals={serialize(newArrivals)}
      bestSellers={serialize(bestSellers)}
      schoolUniforms={serialize(schoolUniforms)}
      categories={serialize(categories)}
    />
  );
}
