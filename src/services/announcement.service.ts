import prisma from '@/lib/prisma';

const priorityWeight: Record<string, number> = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

export class AnnouncementService {
  static async getActiveAnnouncements() {
    const now = new Date();

    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        startAt: { lte: now },
        OR: [
          { endAt: null },
          { endAt: { gte: now } },
        ],
      },
    });

    // Sort by priority weight desc, then createdAt desc
    announcements.sort((a, b) => {
      const weightA = priorityWeight[a.priority] || 2;
      const weightB = priorityWeight[b.priority] || 2;
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return announcements.map((item) => ({
      ...item,
      views: item.totalViews,
      clicks: item.totalClicks,
    }));
  }

  static async getAllAnnouncements(params: any) {
    const page = parseInt(params.page || '1');
    const limit = parseInt(params.limit || '20');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      where.OR = [
        { internalName: { contains: params.search } },
        { type: { contains: params.search } },
      ];
    }

    if (params.status === 'active') {
      const now = new Date();
      where.isActive = true;
      where.startAt = { lte: now };
      where.OR = [
        { endAt: null },
        { endAt: { gte: now } },
      ];
    } else if (params.status === 'inactive') {
      where.isActive = false;
    } else if (params.status === 'scheduled') {
      const now = new Date();
      where.isActive = true;
      where.startAt = { gt: now };
    } else if (params.status === 'expired') {
      const now = new Date();
      where.endAt = { lt: now };
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.announcement.count({ where }),
    ]);

    return {
      announcements: announcements.map((item) => ({
        ...item,
        views: item.totalViews,
        clicks: item.totalClicks,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getAnnouncementById(id: string) {
    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });
    if (!announcement) throw new Error('Announcement not found.');
    return {
      ...announcement,
      views: announcement.totalViews,
      clicks: announcement.totalClicks,
    };
  }

  static async createAnnouncement(data: any, createdBy?: string) {
    const { highlightText, ...rest } = data;
    const announcement = await prisma.announcement.create({
      data: {
        internalName: rest.internalName,
        type: rest.type,
        title: rest.title,
        subtitle: rest.subtitle || null,
        content: rest.content || null,
        displayType: rest.displayType || 'center_popup',
        popupStyle: rest.popupStyle || 'promotion',
        primaryColor: rest.primaryColor || '#0F4C3A',
        accentColor: rest.accentColor || '#9B111E',
        image: rest.image || null,
        ctaEnabled: typeof rest.ctaEnabled === 'boolean' ? rest.ctaEnabled : true,
        ctaText: rest.ctaText || null,
        ctaUrl: rest.ctaUrl || null,
        allowDoNotShowAgain: typeof rest.allowDoNotShowAgain === 'boolean' ? rest.allowDoNotShowAgain : true,
        displayFrequency: rest.displayFrequency || 'once_session',
        priority: rest.priority || 'high',
        isActive: typeof rest.isActive === 'boolean' ? rest.isActive : true,
        startAt: rest.startAt ? new Date(rest.startAt) : new Date(),
        endAt: rest.endAt ? new Date(rest.endAt) : null,
      },
    });
    return {
      ...announcement,
      views: announcement.totalViews,
      clicks: announcement.totalClicks,
    };
  }

  static async updateAnnouncement(id: string, data: any) {
    const { highlightText, ...rest } = data;
    const updatePayload: any = { ...rest };
    if (data.startAt) updatePayload.startAt = new Date(data.startAt);
    if (data.endAt !== undefined) {
      updatePayload.endAt = data.endAt ? new Date(data.endAt) : null;
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: updatePayload,
    });
    return {
      ...announcement,
      views: announcement.totalViews,
      clicks: announcement.totalClicks,
    };
  }

  static async deleteAnnouncement(id: string) {
    await prisma.announcement.delete({
      where: { id },
    });
    return { id };
  }

  static async toggleStatus(id: string, isActive?: boolean) {
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw new Error('Announcement not found.');

    const newStatus = typeof isActive === 'boolean' ? isActive : !existing.isActive;
    const announcement = await prisma.announcement.update({
      where: { id },
      data: { isActive: newStatus },
    });
    return {
      ...announcement,
      views: announcement.totalViews,
      clicks: announcement.totalClicks,
    };
  }

  static async trackEvent(id: string, type: 'view' | 'click' | 'dismissal') {
    if (type === 'view') {
      await prisma.announcement.update({
        where: { id },
        data: { totalViews: { increment: 1 } },
      });
    } else if (type === 'click') {
      await prisma.announcement.update({
        where: { id },
        data: { totalClicks: { increment: 1 } },
      });
    }
    return { success: true };
  }
}
export default AnnouncementService;
