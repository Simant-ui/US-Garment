import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seed() {
  try {
    const { default: connectDB } = await import('../src/lib/mongodb');
    const { default: Category } = await import('../src/models/Category');
    const { default: Product } = await import('../src/models/Product');
    const { default: Coupon } = await import('../src/models/Coupon');
    const { default: SiteSettings } = await import('../src/models/SiteSettings');
    const { default: Announcement } = await import('../src/models/Announcement');

    const db = await connectDB();
    if (!db) {
      console.error('❌ MongoDB Atlas connection unavailable (Check network DNS or URI credentials).');
      process.exit(1);
    }

    console.log('Seeding Database for US Dresses and Garment Udyog on MongoDB Atlas...');

    // Clear old sample data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await SiteSettings.deleteMany({});
    await Announcement.deleteMany({});

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

    // 1. Insert Categories
    const insertedCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Created ${insertedCategories.length} categories on MongoDB Atlas.`);

    const categoryMap = new Map(insertedCategories.map((cat) => [cat.slug, cat._id]));

    // 2. Insert Sample Products
    const sampleProducts = [
      {
        name: 'Designer Royal Blue Embroidered Kurtha Set',
        slug: 'designer-royal-blue-embroidered-kurtha-set',
        sku: 'KUR-001',
        description: 'Premium Royal Blue silk-cotton blend Kurtha set with detailed gold thread hand embroidery on neck and sleeves. Comes with matching Dupatta and comfortable Palazzo.',
        shortDescription: 'Hand-embroidered designer Royal Blue Kurtha set with Dupatta & Palazzo',
        category: categoryMap.get('ladies-kurtha'),
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
        status: 'PUBLISHED',
      },
      {
        name: 'Standard School Uniform White Shirt',
        slug: 'standard-school-uniform-white-shirt',
        sku: 'SCH-SHIRT-01',
        description: 'High durability poly-cotton blended white collared shirt engineered for active school days. Stain-resistant and easy to iron.',
        shortDescription: 'Durable poly-cotton school uniform white collared shirt',
        category: categoryMap.get('school-uniform'),
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
        tags: ['school', 'uniform', 'shirt', 'white'],
        material: 'Poly-Cotton',
        careInstructions: 'Machine wash warm, iron medium heat',
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        isOnSale: false,
        status: 'PUBLISHED',
      },
      {
        name: 'Red House Dress Uniform',
        slug: 'red-house-dress-uniform',
        sku: 'HS-RED-01',
        description: 'Vibrant red school house dress crafted from soft, breathable cotton jersey. Features reinforced stitching for maximum longevity.',
        shortDescription: 'Comfortable red house dress for school sports and house activities',
        category: categoryMap.get('house-dress'),
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
        tags: ['house-dress', 'school', 'uniform', 'red'],
        material: '100% Combed Cotton',
        careInstructions: 'Machine wash cold',
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        isOnSale: false,
        status: 'PUBLISHED',
      },
      {
        name: 'Premium Bio-Washed Unisex Cotton T-Shirt',
        slug: 'premium-bio-washed-unisex-cotton-t-shirt',
        sku: 'TSH-001',
        description: 'Super soft 180 GSM 100% combed cotton t-shirt with bio-wash finish for minimal shrinkage and maximum comfort.',
        shortDescription: '180 GSM bio-washed 100% cotton crewneck t-shirt',
        category: categoryMap.get('t-shirts'),
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
        tags: ['t-shirt', 'casual', 'cotton', 'unisex'],
        material: '180 GSM Combed Cotton',
        careInstructions: 'Machine wash cool, tumble dry low',
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: true,
        isOnSale: true,
        status: 'PUBLISHED',
      }
    ];

    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${insertedProducts.length} products on MongoDB Atlas.`);

    // 3. Insert Coupons
    await Coupon.create({
      code: 'FESTIVE10',
      description: '10% discount on all garment orders',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 1000,
      expiryDate: new Date('2027-12-31'),
      isActive: true,
    });
    console.log('✅ Created initial FESTIVE10 coupon.');

    // 4. Insert Announcement Notice
    await Announcement.create({
      internalName: 'Dashain Festive Special Offer',
      type: 'Offer / Promotion',
      title: {
        en: 'Grand Festive Sale is Live!',
        ne: 'भव्य चाडपर्व अफर सुरु भयो!'
      },
      subtitle: {
        en: 'Get up to 20% off on custom stitching and school uniform orders.',
        ne: 'कस्टम सिलाई र स्कूल पोसाकमा २०% सम्म छुट पाउनुहोस्।'
      },
      content: {
        en: 'Use code FESTIVE10 at checkout for an instant 10% discount on orders above NPR 1,000.',
        ne: 'NPR १,००० भन्दा माथिका अर्डरहरूमा १०% छुट पाउन चेकआउटमा FESTIVE10 कोड प्रयोग गर्नुहोस्।'
      },
      displayType: 'center_popup',
      popupStyle: 'promotion',
      primaryColor: '#0F4C3A',
      accentColor: '#9B111E',
      ctaEnabled: true,
      ctaText: {
        en: 'Shop Festive Collections',
        ne: 'अहिले किनमेल गर्नुहोस्'
      },
      ctaUrl: '/shop',
      allowDoNotShowAgain: true,
      displayFrequency: 'once_session',
      priority: 'high',
      isActive: true,
      startAt: new Date(),
      endAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });
    console.log('✅ Created initial Announcement popup on MongoDB Atlas.');

    // 5. Insert Site Settings
    await SiteSettings.create({
      businessName: 'US Dresses and Garment Udyog',
      tagline: 'गुणस्तरीय पोशाक, विश्वास हाम्रो शान',
      phone: '+977 9855012345',
      whatsapp: '+9779855012345',
      email: 'info@usdresses.com.np',
      address: 'Hetauda-04, Main Road, Makwanpur, Nepal',
      shippingCharge: 150,
      freeShippingThreshold: 3000,
    });
    console.log('✅ Created default SiteSettings.');

    console.log('\n🎉 ALL MONGODB ATLAS TABLES & COLLECTIONS SEEDED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
}

seed();

