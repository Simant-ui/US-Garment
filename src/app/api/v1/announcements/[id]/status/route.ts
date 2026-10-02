import { NextRequest } from 'next/server';
import { AnnouncementController } from '@/controllers/announcement.controller';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return AnnouncementController.updateStatus(req, id);
}
