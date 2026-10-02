import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export class ProductService {
  static async getProducts(params: any) {
    await connectDB();
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '20');
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params.status) {
      query.status = params.status;
    } else {
      query.status = 'PUBLISHED';
    }

    if (params.category) {
      const catObj = await Category.findOne({ slug: params.category }).lean();
      if (catObj) {
        query.category = catObj._id;
      } else {
        query.category = params.category;
      }
    }

    if (params.search) {
      const regex = new RegExp(params.search, 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { tags: regex },
        { sku: regex },
      ];
    }

    if (params.size) query.sizes = params.size;
    if (params.color) query.colors = { $regex: params.color, $options: 'i' };

    if (params.minPrice || params.maxPrice) {
      query.price = {};
      if (params.minPrice) query.price.$gte = Number(params.minPrice);
      if (params.maxPrice) query.price.$lte = Number(params.maxPrice);
    }

    if (params.featured === 'true') query.isFeatured = true;
    if (params.inStock === 'true') query.stock = { $gt: 0 };

    let sortOptions: any = { createdAt: -1 };
    if (params.sort === 'price-low') sortOptions = { price: 1 };
    if (params.sort === 'price-high') sortOptions = { price: -1 };
    if (params.sort === 'best-selling') sortOptions = { isBestSeller: -1, createdAt: -1 };
    if (params.sort === 'featured') sortOptions = { isFeatured: -1, createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(id: string) {
    await connectDB();
    const product = await Product.findById(id).populate('category', 'name slug').lean();
    if (!product) throw new Error('Product not found.');
    return product;
  }

  static async getProductBySlug(slug: string) {
    await connectDB();
    const product = await Product.findOne({ $or: [{ slug }, { sku: slug }] })
      .populate('category', 'name slug')
      .lean();
    if (!product) throw new Error('Product not found.');
    return product;
  }

  static async createProduct(data: any) {
    await connectDB();
    const newProduct = await Product.create(data);
    return newProduct;
  }

  static async updateProduct(id: string, data: any) {
    await connectDB();
    const updated = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new Error('Product not found.');
    return updated;
  }

  static async deleteProduct(id: string) {
    await connectDB();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) throw new Error('Product not found.');
    return { id };
  }

  static async updateStock(id: string, stock: number) {
    await connectDB();
    const updated = await Product.findByIdAndUpdate(id, { stock }, { new: true });
    if (!updated) throw new Error('Product not found.');
    return updated;
  }

  static async updateStatus(id: string, status: string) {
    await connectDB();
    const updated = await Product.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) throw new Error('Product not found.');
    return updated;
  }
}
