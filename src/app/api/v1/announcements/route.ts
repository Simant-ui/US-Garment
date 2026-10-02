import { NextRequest } from 'next/server';
import { AnnouncementController } from '@/controllers/announcement.controller';

export async function GET(req: NextRequest) {
  return AnnouncementController.getAllAnnouncements(req);
}

export async function POST(req: NextRequest) {
  return AnnouncementController.createAnnouncement(req);
}
