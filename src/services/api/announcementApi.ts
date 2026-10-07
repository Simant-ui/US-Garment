export interface BilingualText {
  en: string;
  ne: string;
}

export interface AnnouncementData {
  id?: string;
  _id?: string;
  internalName: string;
  type: 'general' | 'holiday' | 'important' | 'offer' | 'delivery' | 'maintenance' | 'custom';
  title: BilingualText;
  subtitle?: BilingualText;
  content: BilingualText;
  highlightText?: BilingualText;
  image?: string;
  displayType: 'center_popup' | 'top_banner';
  popupStyle: 'standard' | 'important' | 'promotion' | 'minimal' | 'image_banner';
  primaryColor?: string;
  accentColor?: string;
  ctaEnabled: boolean;
  ctaText?: BilingualText;
  ctaUrl?: string;
  allowDoNotShowAgain: boolean;
  displayFrequency: 'every_visit' | 'once_session' | 'once_day' | 'once_only';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isActive: boolean;
  startAt: string;
  endAt: string;
  views?: number;
  clicks?: number;
  dismissals?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const getActiveAnnouncements = async (): Promise<AnnouncementData[]> => {
  try {
    const res = await fetch('/api/v1/announcements/active', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('getActiveAnnouncements failed:', err);
    return [];
  }
};

export const getAnnouncements = async (params: Record<string, string> = {}): Promise<{ announcements: AnnouncementData[]; pagination?: any }> => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`/api/v1/announcements?${query}`, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch announcements');
  return { announcements: data.data || [], pagination: data.pagination };
};

export const getAnnouncement = async (id: string): Promise<AnnouncementData> => {
  const res = await fetch(`/api/v1/announcements/${id}`, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch announcement');
  return data.data;
};

export const createAnnouncement = async (formData: Partial<AnnouncementData>): Promise<AnnouncementData> => {
  const res = await fetch('/api/v1/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create announcement');
  return data.data;
};

export const updateAnnouncement = async (id: string, formData: Partial<AnnouncementData>): Promise<AnnouncementData> => {
  const res = await fetch(`/api/v1/announcements/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update announcement');
  return data.data;
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  const res = await fetch(`/api/v1/announcements/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete announcement');
};

export const updateAnnouncementStatus = async (id: string, isActive: boolean): Promise<AnnouncementData> => {
  const res = await fetch(`/api/v1/announcements/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update status');
  return data.data;
};

export const trackAnnouncementEvent = async (id: string, type: 'view' | 'click' | 'dismissal'): Promise<void> => {
  try {
    await fetch(`/api/v1/announcements/${id}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
  } catch (err) {
    console.error('Tracking failed silently', err);
  }
};
