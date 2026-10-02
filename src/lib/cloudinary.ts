import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || '1234567890',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz',
  secure: true,
});

export async function uploadImageToCloudinary(fileBufferOrBase64: string, folder = 'garment_us'): Promise<{ url: string; public_id: string }> {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud') {
      const result = await cloudinary.uploader.upload(fileBufferOrBase64, {
        folder: folder,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' }
        ]
      });
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } else {
      // Fallback for dev mode without Cloudinary API credentials
      return {
        url: fileBufferOrBase64.startsWith('data:') ? fileBufferOrBase64 : `https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80`,
        public_id: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
}

export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud') {
      await cloudinary.uploader.destroy(publicId);
    }
    return true;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return false;
  }
}

export default cloudinary;
