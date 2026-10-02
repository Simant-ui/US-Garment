import { NextRequest } from 'next/server';
import { AnnouncementController } from '@/controllers/announcement.controller';

export async function GET() {
  return AnnouncementController.getActiveAnnouncements();
}
