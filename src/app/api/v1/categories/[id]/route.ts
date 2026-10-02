import { NextRequest } from 'next/server';
import { CategoryController } from '@/controllers/category.controller';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return CategoryController.getCategoryById(req, id);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return CategoryController.updateCategory(req, id);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return CategoryController.deleteCategory(req, id);
}
