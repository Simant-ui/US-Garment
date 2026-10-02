import { NextRequest } from 'next/server';
import { CategoryController } from '@/controllers/category.controller';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return CategoryController.getCategoryBySlug(req, slug);
}
