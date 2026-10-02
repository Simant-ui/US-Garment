import { NextRequest } from 'next/server';
import { AnnouncementService } from '@/services/announcement.service';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { createAnnouncementSchema } from '@/validations/announcement.schema';
import { getAdminUser } from '@/lib/auth';

export class AnnouncementController {
  static async getActiveAnnouncements() {
    try {
      const data = await AnnouncementService.getActiveAnnouncements();
      return successResponse(data);
    } catch (err: any) {
      console.warn('Failed to fetch active announcements:', err.message);
      return successResponse([], 'Active announcements temporarily unavailable', 200);
    }
  }

  static async getAllAnnouncements(req: NextRequest) {
    try {
      const admin = await getAdminUser(req);
      if (!admin) return errorResponse('Unauthorized Admin Access', 401);

      const url = new URL(req.url);
      const params = Object.fromEntries(url.searchParams.entries());

      const { announcements, pagination } = await AnnouncementService.getAllAnnouncements(params);
      return successResponse(announcements, undefined, 200, pagination);
    } catch (err: any) {
      return errorResponse(err.message || 'Failed to fetch announcements', 500);
    }
  }

  static async getAnnouncementById(req: NextRequest, id: string) {
    try {
      const admin = await getAdminUser(req);
      if (!admin) return errorResponse('Unauthorized Admin Access', 401);

      const data = await AnnouncementService.getAnnouncementById(id);
      return successResponse(data);
    } catch (err: any) {
      return errorResponse(err.message || 'Announcement not found', 404);
    }
  }

  static async createAnnouncement(req: NextRequest) {
    try {
      const admin = await getAdminUser(req);
      if (!admin) return errorResponse('Unauthorized Admin Access', 401);

      const body = await req.json();
      const parsed = createAnnouncementSchema.safeParse(body);
      if (!parsed.success) {
        return errorResponse('Validation Error', 400, parsed.error.issues);
      }

      const data = await AnnouncementService.createAnnouncement(parsed.data, admin.userId);
      return successResponse(data, 'Announcement created successfully', 201);
    } catch (err: any) {
      return errorResponse(err.message || 'Failed to create announcement', 400);
    }
  }

  static async updateAnnouncement(req: NextRequest, id: string) {
    try {
      const admin = await getAdminUser(req);
      if (!admin) return errorResponse('Unauthorized Admin Access', 401);

      const body = await req.json();
      const data = await AnnouncementService.updateAnnouncement(id, body);
      return successResponse(data, 'Announcement updated successfully');
    } catch (err: any) {
      return errorResponse(err.message || 'Failed to update announcement', 400);
    }
  }

  static async deleteAnnouncement(req: NextRequest, id: string) {
    try {
      const admin = await getAdminUser(req);
      if (!admin) return errorResponse('Unauthorized Admin Access', 401);

      const data = await AnnouncementService.deleteAnnouncement(id);
      return successResponse(data, 'Announcement deleted successfully');
    } catch (err: any) {
      return errorResponse(err.message || 'Failed to delete announcement', 400);
    }
  }

  static async updateStatus(req: NextRequest, id: string) {
    try {
      const admin = await getAdminUser(req);
      if (!admin) return errorResponse('Unauthorized Admin Access', 401);

      const body = await req.json().catch(() => ({}));
      const data = await AnnouncementService.toggleStatus(id, body.isActive);
      return successResponse(data, 'Announcement status updated');
    } catch (err: any) {
      return errorResponse(err.message || 'Failed to update status', 400);
    }
  }

  static async trackEvent(req: NextRequest, id: string) {
    try {
      const body = await req.json();
      const type = body.type as 'view' | 'click' | 'dismissal';
      await AnnouncementService.trackEvent(id, type);
      return successResponse({ tracked: true });
    } catch (err: any) {
      return errorResponse('Tracking error', 400);
    }
  }
}
