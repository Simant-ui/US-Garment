import React from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductDetailPageClient from './ProductDetailPageClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const db = await connectDB();
  let product: any = null;
  if (db) {
    try {
      product = await Product.findOne({ $or: [{ slug }, { sku: slug }] }).lean();
    } catch {}
  }

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
  const db = await connectDB();

  let product: any = null;
  let relatedProducts: any[] = [];

  if (db) {
    try {
      product = await Product.findOne({ $or: [{ slug }, { sku: slug }] })
        .populate('category', 'name slug')
        .lean();

      if (product) {
        relatedProducts = await Product.find({
          category: (product.category as any)?._id || product.category,
          _id: { $ne: product._id },
          status: 'PUBLISHED',
        })
          .limit(4)
          .lean();
      }
    } catch (e) {
      console.warn(`Failed to load product detail for ${slug}:`, e);
    }
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
