import React from 'react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { STANDARD_SIZES, COLOR_OPTIONS } from '@/lib/constants';
import ShopPageClient from './ShopPageClient';

interface ShopProps {
  searchParams: Promise<{
    category?: string;
    size?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopProps) {
  const params = await searchParams;
  const db = await connectDB();

  const categorySlug = params.category;
  const selectedSize = params.size;
  const selectedColor = params.color;
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const sort = params.sort || 'newest';
  const searchQuery = params.search;
  const page = parseInt(params.page || '1');
  const limit = 12;

  const query: any = { status: 'PUBLISHED' };

  if (searchQuery) {
    query.$or = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
      { tags: { $regex: searchQuery, $options: 'i' } },
    ];
  }

  let selectedCategoryObj: any = null;
  let products: any[] = [];
  let totalCount = 0;
  let dbCategories: any[] = [];

  if (db) {
    try {
      if (categorySlug) {
        selectedCategoryObj = await Category.findOne({ slug: categorySlug }).lean();
        if (selectedCategoryObj) {
          query.category = selectedCategoryObj._id;
        }
      }

      if (selectedSize) query.sizes = selectedSize;
      if (selectedColor) query.colors = { $regex: selectedColor, $options: 'i' };

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOptions: any = { createdAt: -1 };
      if (sort === 'price-low') sortOptions = { price: 1 };
      if (sort === 'price-high') sortOptions = { price: -1 };
      if (sort === 'best-selling') sortOptions = { isBestSeller: -1, createdAt: -1 };
      if (sort === 'featured') sortOptions = { isFeatured: -1, createdAt: -1 };

      const skip = (page - 1) * limit;

      [products, totalCount, dbCategories] = await Promise.all([
        Product.find(query)
          .populate('category', 'name slug')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(query),
        Category.find({ isActive: true }).sort({ orderIndex: 1 }).lean(),
      ]);
    } catch (e) {
      console.warn('Failed to query shop products:', e);
    }
  }

  const totalPages = Math.ceil(totalCount / limit);
  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return (
    <ShopPageClient
      products={serialize(products)}
      totalCount={totalCount}
      dbCategories={serialize(dbCategories)}
      selectedCategoryObj={selectedCategoryObj ? serialize(selectedCategoryObj) : null}
      categorySlug={categorySlug}
      selectedSize={selectedSize}
      selectedColor={selectedColor}
      minPrice={minPrice}
      maxPrice={maxPrice}
      sort={sort}
      searchQuery={searchQuery}
      page={page}
      totalPages={totalPages}
      standardSizes={STANDARD_SIZES}
      colorOptions={COLOR_OPTIONS}
    />
  );
}
