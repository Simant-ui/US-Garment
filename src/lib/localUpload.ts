import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function saveLocalImage(fileOrBase64: File | string, folderName = 'uploads'): Promise<{ url: string; public_id: string }> {
  const uploadDir = path.join(process.cwd(), 'public', folderName);

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  if (typeof fileOrBase64 === 'string') {
    // Base64 string input
    const matches = fileOrBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image data string format');
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');

    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error('Image size exceeds 5 MB limit. Please upload a smaller image.');
    }

    const ext = mimeType.split('/')[1] || 'png';
    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return {
      url: `/${folderName}/${filename}`,
      public_id: filename,
    };
  } else {
    // File object input
    const file = fileOrBase64 as File;

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image size exceeds 5 MB limit. Please upload a smaller image.');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.png';
    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return {
      url: `/${folderName}/${filename}`,
      public_id: filename,
    };
  }
}
