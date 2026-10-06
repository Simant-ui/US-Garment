import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log('🌱 Starting MySQL database seeding for US Dresses & Garment Udyog...');

  // 1. Seed Super Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@usdresses.com.np';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminGarmentUS2026!';
  const hashedPassword = await hashPassword(adminPassword);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      name: 'US Garment Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      permissions: ['*'],
      isActive: true,
    },
  });
  console.log(`✅ Super Admin ready: ${admin.email}`);

  // 2. Seed Categories
  const sampleCategories = [
    { name: 'Ladies Kurtha', slug: 'ladies-kurtha', description: 'Traditional and designer ladies kurthas with premium embroidery', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', orderIndex: 1 },
    { name: 'Ladies Gown', slug: 'ladies-gown', description: 'Elegant evening and festive ladies gowns crafted in Hetauda', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80', orderIndex: 2 },
    { name: 'T-Shirts', slug: 't-shirts', description: 'Premium 100% combed cotton t-shirts for everyday wear', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', orderIndex: 3 },
    { name: 'Dresses', slug: 'dresses', description: 'Trendy dresses for formal and casual Nepali lifestyle', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', orderIndex: 4 },
    { name: 'School Uniform', slug: 'school-uniform', description: 'Durable, high-quality school shirts, trousers, skirts, and blazers', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80', orderIndex: 5 },
    { name: 'House Dress', slug: 'house-dress', description: 'Institutional and school house dresses tailored for maximum comfort', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', orderIndex: 6 },
    { name: 'Sweatshirts', slug: 'sweatshirts', description: 'Warm fleece sweatshirts crafted for Nepali winter seasons', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', orderIndex: 7 },
    { name: 'Jackets', slug: 'jackets', description: 'Weatherproof, padded, and school varsity jackets', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80', orderIndex: 8 },
    { name: 'Track Suits', slug: 'track-suits', description: 'High-performance athletic track suits for schools and individuals', image: 'https://images.unsplash.com/photo-1483721061946-dc8579017732?w=800&q=80', orderIndex: 9 },
    { name: 'Sportswear', slug: 'sportswear', description: 'Breathable sports jerseys, shorts, and activewear', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80', orderIndex: 10 },
    { name: 'Custom Stitching', slug: 'custom-stitching', description: 'Bespoke tailoring, custom design stitching for all sizes', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80', orderIndex: 11 },
    { name: 'Wholesale & Bulk', slug: 'wholesale', description: 'Factory-direct garment manufacturing for bulk institutional buyers', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80', orderIndex: 12 },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of sampleCategories) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, createdCat.id);
  }
  console.log(`✅ ${sampleCategories.length} Categories seeded into MySQL.`);

  // 3. Seed Sample Products
  const sampleProducts = [
    {
      name: 'Designer Royal Blue Embroidered Kurtha Set',
      slug: 'designer-royal-blue-embroidered-kurtha-set',
      sku: 'KUR-001',
      description: 'Premium Royal Blue silk-cotton blend Kurtha set with detailed gold thread hand embroidery on neck and sleeves. Comes with matching Dupatta and comfortable Palazzo.',
      shortDescription: 'Hand-embroidered designer Royal Blue Kurtha set with Dupatta & Palazzo',
      categoryId: categoryMap.get('ladies-kurtha'),
      brand: 'US Dresses & Garment Udyog',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      price: 2450,
      compareAtPrice: 2850,
      discount: 14,
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['Royal Blue', 'Maroon'],
      stock: 45,
      tags: ['kurtha', 'embroidered', 'festive', 'ladies'],
      material: 'Silk Cotton Blend',
      careInstructions: 'Dry clean or gentle hand wash',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isOnSale: true,
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Standard School Uniform White Shirt',
      slug: 'standard-school-uniform-white-shirt',
      sku: 'SCH-SHIRT-01',
      description: 'High durability poly-cotton blended white collared shirt engineered for active school days. Stain-resistant and easy to iron.',
      shortDescription: 'Durable poly-cotton school uniform white collared shirt',
      categoryId: categoryMap.get('school-uniform'),
      brand: 'US Dresses & Garment Udyog',
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
      price: 650,
      compareAtPrice: 750,
      discount: 13,
      sizes: ['28', '30', '32', '34', '36', '38'],
      colors: ['White'],
      stock: 120,
      tags: ['school', 'uniform', 'shirt', 'white', 'School Uniform'],
      material: 'Poly-Cotton',
      careInstructions: 'Machine wash warm, iron medium heat',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      isOnSale: false,
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Red House Dress Uniform',
      slug: 'red-house-dress-uniform',
      sku: 'HS-RED-01',
      description: 'Vibrant red school house dress crafted from soft, breathable cotton jersey. Features reinforced stitching for maximum longevity.',
      shortDescription: 'Comfortable red house dress for school sports and house activities',
      categoryId: categoryMap.get('house-dress'),
      brand: 'US Dresses & Garment Udyog',
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      price: 850,
      compareAtPrice: 950,
      discount: 10,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Red', 'Blue', 'Green', 'Yellow'],
      stock: 80,
      tags: ['house-dress', 'school', 'uniform', 'red', 'House Dress'],
      material: '100% Combed Cotton',
      careInstructions: 'Machine wash cold',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isOnSale: false,
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Premium Bio-Washed Unisex Cotton T-Shirt',
      slug: 'premium-bio-washed-unisex-cotton-t-shirt',
      sku: 'TSH-001',
      description: 'Super soft 180 GSM 100% combed cotton t-shirt with bio-wash finish for minimal shrinkage and maximum comfort.',
      shortDescription: '180 GSM bio-washed 100% cotton crewneck t-shirt',
      categoryId: categoryMap.get('t-shirts'),
      brand: 'US Dresses & Garment Udyog',
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
      price: 550,
      compareAtPrice: 650,
      discount: 15,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Navy Blue', 'White', 'Charcoal'],
      stock: 150,
      tags: ['t-shirt', 'casual', 'cotton', 'unisex', 'T-Shirt'],
      material: '180 GSM Combed Cotton',
      careInstructions: 'Machine wash cool, tumble dry low',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      isOnSale: true,
      status: ProductStatus.PUBLISHED,
    },
  ];

  for (const prod of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log(`✅ ${sampleProducts.length} Products seeded into MySQL.`);

  // 4. Seed Coupon
  await prisma.coupon.upsert({
    where: { code: 'FESTIVE10' },
    update: {
      description: '10% discount on all garment orders',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 1000,
      expiryDate: new Date('2027-12-31'),
      isActive: true,
    },
    create: {
      code: 'FESTIVE10',
      description: '10% discount on all garment orders',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 1000,
      expiryDate: new Date('2027-12-31'),
      isActive: true,
    },
  });
  console.log('✅ FESTIVE10 coupon seeded.');

  // 5. Seed Site Settings
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        businessName: 'US Dresses and Garment Udyog',
        tagline: 'गुणस्तरीय पोशाक, विश्वास हाम्रो शान',
        phone: '+977 9855012345',
        whatsapp: '+9779855012345',
        email: 'info@usdresses.com.np',
        address: 'Hetauda-04, Main Road, Makwanpur, Nepal',
        shippingCharge: 150,
        freeShippingThreshold: 3000,
      },
    });
    console.log('✅ SiteSettings seeded.');
  }

  console.log('\n🎉 MYSQL SEEDING COMPLETED SUCCESSFULLY!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
