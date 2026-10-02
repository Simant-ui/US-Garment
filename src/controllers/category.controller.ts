import { NextRequest } from 'next/server';
import { CategoryService } from '@/services/category.service';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getAdminUser } from '@/lib/auth';

export class CategoryController {
  static async getCategories(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const params = Object.fromEntries(url.searchParams.entries());

      const data = await CategoryService.getCategories(params);
      return successResponse(data);
    } catch (err: any) {
      return errorResponse(err.message || 'Failed to fetch categories', 500);
    }
  }

  static async getCategoryById(req: NextRequest, id: string) {
    try {
      const data = await CategoryService.getCategoryById(id);
      return successResponse(data);
    } catch (err: any) {
      return errorResponse(err.message || 'Category not found', 404);
    }
  }

  static async getCategoryBySlug(req: NextRequest, slug: string) {
    try {
      const data = await CategoryService.getCategoryBySlug(slug);
      return successResponse(data);
    } catch (err: any) {
      return errorResponse(err.message || 'Category not found', 404);
    }
  }

  static async createCategory(req: NextRequest) {
    try {
      const admin = await getAdminUser(req);
      if (!admin) return errorResponse('Unauthorized Admin Access', 401);

      const body = await req.json();
      const data = await CategoryService.createCategory(body);
      return successResponse(data, 'Category created successfully', 201);
    } catch (err: any) {
      return errorResponse(err.message || 'Failed to create category', 400);
    }
  }

  static async updateCategory(req: NextRequest, id: string) {
    try {
      const admin = await getAdminUser(req);
      if (!admin) return errorResponse('Unauthorized Admin Access', 401);

      const body = await req.json();
      const data = await CategoryService.updateCategory(id, body);
      return successResponse(data, 'Category updated successfully');
    } catch (err: any) {
      return errorResponse(err.message || 'Failed to update category', 400);
    }
  }

  static async deleteCategory(req: NextRequest, id: string) {
    try {
      const admin = await getAdminUser(req);
      if (!admin) return errorResponse('Unauthorized Admin Access', 401);

      const data = await CategoryService.deleteCategory(id);
      return successResponse(data, 'Category deleted successfully');
    } catch (err: any) {
      return errorResponse(err.message || 'Failed to delete category', 400);
    }
  }
}
