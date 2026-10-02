import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

export class CategoryService {
  static async getCategories(params: any = {}) {
    const conn = await connectDB();
    if (!conn || mongoose.connection.readyState !== 1) {
      console.warn('MongoDB connection unavailable. Returning empty categories.');
      return { tree: [], all: [] };
    }
    const query: any = {};

    if (params.activeOnly !== 'false') {
      query.isActive = true;
    }

    const categories = await Category.find(query)
      .sort({ sortOrder: 1, orderIndex: 1, createdAt: 1 })
      .lean();

    // Get real product counts per category
    const productCounts = await Product.aggregate([
      { $match: { status: 'PUBLISHED' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    productCounts.forEach((item) => {
      if (item._id) {
        countMap[item._id.toString()] = item.count;
      }
    });

    const categoriesWithCount = categories.map((cat: any) => ({
      ...cat,
      productCount: countMap[cat._id.toString()] || 0,
    }));

    // Build hierarchy (Parent categories -> subcategories)
    const parents = categoriesWithCount.filter((cat: any) => !cat.parentCategory);

    const tree = parents.map((parent: any) => {
      const children = categoriesWithCount.filter(
        (cat: any) => cat.parentCategory && cat.parentCategory.toString() === parent._id.toString()
      );

      // Parent's total count includes own + subcategories counts
      const subcategoriesTotal = children.reduce((acc: number, child: any) => acc + (child.productCount || 0), 0);

      return {
        ...parent,
        productCount: (parent.productCount || 0) + subcategoriesTotal,
        subcategories: children,
      };
    });

    return {
      all: categoriesWithCount,
      tree,
    };
  }

  static async getCategoryById(id: string) {
    await connectDB();
    const category = await Category.findById(id).lean();
    if (!category) throw new Error('Category not found.');
    return category;
  }

  static async getCategoryBySlug(slug: string) {
    await connectDB();
    const category = await Category.findOne({ slug }).lean();
    if (!category) throw new Error('Category not found.');
    return category;
  }

  static async createCategory(data: any) {
    await connectDB();
    const category = await Category.create(data);
    return category;
  }

  static async updateCategory(id: string, data: any) {
    await connectDB();
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    if (!category) throw new Error('Category not found.');
    return category;
  }

  static async deleteCategory(id: string) {
    await connectDB();
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error('Category not found.');
    return { id };
  }
}
