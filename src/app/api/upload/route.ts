import { NextRequest, NextResponse } from 'next/server';
import { saveLocalImage } from '@/lib/localUpload';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: 'No image file uploaded' }, { status: 400 });
      }

      const uploadResult = await saveLocalImage(file);
      return NextResponse.json({ success: true, ...uploadResult });
    } else {
      const body = await req.json();
      const { image } = body;

      if (!image) {
        return NextResponse.json({ success: false, error: 'No image data provided' }, { status: 400 });
      }

      const uploadResult = await saveLocalImage(image);
      return NextResponse.json({ success: true, ...uploadResult });
    }
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Image upload failed' }, { status: 400 });
  }
}
