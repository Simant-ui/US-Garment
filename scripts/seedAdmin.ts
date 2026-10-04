import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function seedAdmin() {
  try {
    const { default: connectDB } = await import('../src/lib/mongodb');
    const { default: AdminUser } = await import('../src/models/AdminUser');
    const { hashPassword } = await import('../src/lib/auth');

    await connectDB();
    const email = process.env.ADMIN_EMAIL || 'admin@usdresses.com.np';
    const password = process.env.ADMIN_PASSWORD || 'AdminGarmentUS2026!';

    console.log(`Checking admin user for email: ${email}...`);

    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password & role...');
      existingAdmin.password = await hashPassword(password);
      existingAdmin.role = 'SUPER_ADMIN';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('✅ Admin account updated successfully on MongoDB Atlas.');
    } else {
      const hashedPassword = await hashPassword(password);
      await AdminUser.create({
        name: 'US Garment Super Admin',
        email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        permissions: ['*'],
        isActive: true,
      });
      console.log('✅ Super Admin created successfully on MongoDB Atlas.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error);
    process.exit(1);
  }
}

seedAdmin();
