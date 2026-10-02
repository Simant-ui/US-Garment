import { NextRequest } from 'next/server';
import { AnnouncementController } from '@/controllers/announcement.controller';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return AnnouncementController.getAnnouncementById(req, id);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return AnnouncementController.getAnnouncementById(req, id);
}
