import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Announcement from '@/models/Announcement';

const priorityWeight: Record<string, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

export class AnnouncementService {
  static async getActiveAnnouncements() {
    const conn = await connectDB();
    if (!conn || mongoose.connection.readyState !== 1) {
      console.warn('MongoDB connection unavailable. Returning empty active announcements.');
      return [];
    }

    const now = new Date();

    const announcements = await Announcement.find({
      isActive: true,
      startAt: { $lte: now },
      endAt: { $gte: now },
    }).lean();

    // Sort by priority weight desc, then createdAt desc
    announcements.sort((a, b) => {
      const weightA = priorityWeight[a.priority] || 2;
      const weightB = priorityWeight[b.priority] || 2;
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return announcements;
  }

  static async getAllAnnouncements(params: any) {
    await connectDB();
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '20');
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params.search) {
      const regex = new RegExp(params.search, 'i');
      query.$or = [
        { internalName: regex },
        { 'title.en': regex },
        { 'title.ne': regex },
        { type: regex },
      ];
    }

    if (params.status === 'active') {
      const now = new Date();
      query.isActive = true;
      query.startAt = { $lte: now };
      query.endAt = { $gte: now };
    } else if (params.status === 'inactive') {
      query.isActive = false;
    } else if (params.status === 'scheduled') {
      const now = new Date();
      query.isActive = true;
      query.startAt = { $gt: now };
    } else if (params.status === 'expired') {
      const now = new Date();
      query.endAt = { $lt: now };
    }

    const [announcements, total] = await Promise.all([
      Announcement.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Announcement.countDocuments(query),
    ]);

    return {
      announcements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getAnnouncementById(id: string) {
    await connectDB();
    const announcement = await Announcement.findById(id).lean();
    if (!announcement) throw new Error('Announcement not found.');
    return announcement;
  }

  static async createAnnouncement(data: any, createdBy?: string) {
    await connectDB();
    const announcement = await Announcement.create({
      ...data,
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
      createdBy: createdBy || null,
    });
    return announcement;
  }

  static async updateAnnouncement(id: string, data: any) {
    await connectDB();
    const updatePayload = { ...data };
    if (data.startAt) updatePayload.startAt = new Date(data.startAt);
    if (data.endAt) updatePayload.endAt = new Date(data.endAt);

    const announcement = await Announcement.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!announcement) throw new Error('Announcement not found.');
    return announcement;
  }

  static async deleteAnnouncement(id: string) {
    await connectDB();
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) throw new Error('Announcement not found.');
    return { id };
  }

  static async toggleStatus(id: string, isActive?: boolean) {
    await connectDB();
    const announcement = await Announcement.findById(id);
    if (!announcement) throw new Error('Announcement not found.');

    announcement.isActive = typeof isActive === 'boolean' ? isActive : !announcement.isActive;
    await announcement.save();
    return announcement;
  }

  static async trackEvent(id: string, type: 'view' | 'click' | 'dismissal') {
    await connectDB();
    const fieldMap = {
      view: 'views',
      click: 'clicks',
      dismissal: 'dismissals',
    };
    const field = fieldMap[type];
    if (!field) return;

    await Announcement.findByIdAndUpdate(id, { $inc: { [field]: 1 } });
    return { success: true };
  }
}
