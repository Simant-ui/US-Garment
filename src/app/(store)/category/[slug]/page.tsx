import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import CategoryCollectionClient from '@/components/common/CategoryCollectionClient';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function DynamicCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  let category: any = null;
  let products: any[] = [];

  try {
    category = await prisma.category.findUnique({ where: { slug, isActive: true } });
    if (category) {
      products = await prisma.product.findMany({
        where: { categoryId: category.id, status: 'PUBLISHED' },
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch (e) {
    console.warn(`Failed to load category ${slug}:`, e);
  }

  if (!category) {
    notFound();
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <CategoryCollectionClient
      fallbackTitle={serialize(category.name)}
      fallbackSubtitle={category.description ? serialize(category.description) : undefined}
      products={serialize(products)}
    />
  );
}
