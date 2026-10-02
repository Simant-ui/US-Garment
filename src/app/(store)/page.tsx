import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import HomePageClient from './HomePageClient';

export const revalidate = 60;

export default async function HomePage() {
  const db = await connectDB();

  let newArrivals: any[] = [];
  let bestSellers: any[] = [];
  let schoolUniforms: any[] = [];
  let categories: any[] = [];

  if (db) {
    try {
      [newArrivals, bestSellers, schoolUniforms, categories] = await Promise.all([
        Product.find({ isNewArrival: true, status: 'PUBLISHED' }).populate('category', 'name slug').limit(4).lean(),
        Product.find({ isBestSeller: true, status: 'PUBLISHED' }).populate('category', 'name slug').limit(4).lean(),
        Product.find({ tags: 'School Uniform', status: 'PUBLISHED' }).populate('category', 'name slug').limit(4).lean(),
        Category.find({ isActive: true }).sort({ orderIndex: 1 }).limit(8).lean(),
      ]);
    } catch (e) {
      console.warn('Failed to load homepage products:', e);
    }
  }

  // Convert MongoDB objects (_id, timestamps) to clean JSON plain objects for React client component serialization
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
