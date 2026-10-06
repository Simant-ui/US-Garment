import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailPageClient from './ProductDetailPageClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: any = null;
  try {
    product = await prisma.product.findFirst({
      where: { OR: [{ slug }, { sku: slug }, { id: slug }] },
    });
  } catch {}

  if (!product) {
    return { title: 'Product | US Dresses Hetauda' };
  }

  const productName = typeof product.name === 'object' && product.name !== null ? (product.name as any).en || (product.name as any).ne : String(product.name || '');

  return {
    title: product.seoTitle || `${productName} | US Dresses Hetauda`,
    description: product.seoDescription || product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    product = await prisma.product.findFirst({
      where: { OR: [{ slug }, { sku: slug }, { id: slug }] },
      include: { category: { select: { name: true, slug: true } } },
    });

    if (product && product.categoryId) {
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          status: 'PUBLISHED',
        },
        take: 4,
      });
    }
  } catch (e) {
    console.warn(`Failed to load product detail for ${slug}:`, e);
  }

  if (!product) {
    notFound();
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <ProductDetailPageClient
      product={serialize(product)}
      relatedProducts={serialize(relatedProducts)}
    />
  );
}
