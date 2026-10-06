import React from 'react';
import prisma from '@/lib/prisma';
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

  const categorySlug = params.category;
  const selectedSize = params.size;
  const selectedColor = params.color;
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const sort = params.sort || 'newest';
  const searchQuery = params.search;
  const page = parseInt(params.page || '1');
  const limit = 12;

  const where: any = { status: 'PUBLISHED' };

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery } },
      { description: { contains: searchQuery } },
    ];
  }

  let selectedCategoryObj: any = null;
  let products: any[] = [];
  let totalCount = 0;
  let dbCategories: any[] = [];

  try {
    if (categorySlug) {
      selectedCategoryObj = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (selectedCategoryObj) {
        where.categoryId = selectedCategoryObj.id;
      }
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { price: 'asc' };
    if (sort === 'price-high') orderBy = { price: 'desc' };
    if (sort === 'best-selling') orderBy = [{ isBestSeller: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'featured') orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];

    const skip = (page - 1) * limit;

    [products, totalCount, dbCategories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { name: true, slug: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { orderIndex: 'asc' },
      }),
    ]);
  } catch (e) {
    console.warn('Failed to query shop products:', e);
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
