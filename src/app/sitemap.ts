import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticRoutes = [
    '',
    '/shop',
    '/women',
    '/ladies-kurtha',
    '/ladies-gown',
    '/t-shirts',
    '/dresses',
    '/school-uniform',
    '/house-dress',
    '/sweatshirts',
    '/jackets',
    '/track-suits',
    '/sportswear',
    '/custom-stitching',
    '/wholesale',
    '/new-arrivals',
    '/best-sellers',
    '/sale',
    '/about',
    '/services',
    '/custom-order',
    '/contact',
    '/faq',
    '/shipping-policy',
    '/return-policy',
    '/privacy-policy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    await connectDB();
    const [products, categories] = await Promise.all([
      Product.find({ status: 'PUBLISHED' }).select('slug updatedAt').lean(),
      Category.find({ isActive: true }).select('slug updatedAt').lean(),
    ]);

    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const categoryRoutes = categories.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: c.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
  } catch (error) {
    return staticRoutes;
  }
}
