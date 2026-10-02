import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { getAdminUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminUser(req);
    // Allow custom order reference uploads by guest or customer, else check admin
    const body = await req.json();
    const { image, folder } = body;

    if (!image) {
      return NextResponse.json({ success: false, error: 'No image data provided' }, { status: 400 });
    }

    const uploadResult = await uploadImageToCloudinary(image, folder || 'garment_us');
    return NextResponse.json({ success: true, ...uploadResult });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Image upload failed' }, { status: 500 });
  }
}
