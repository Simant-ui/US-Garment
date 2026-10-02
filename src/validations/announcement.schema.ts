import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  internalName: z.string().min(2, 'Internal name is required'),
  type: z.enum([
    'General Notice',
    'Holiday Notice',
    'Important Notice',
    'Offer / Promotion',
    'Delivery Update',
    'Maintenance',
    'Custom',
  ]),
  title: z.object({
    en: z.string().default(''),
    ne: z.string().default(''),
  }),
  subtitle: z.object({
    en: z.string().optional(),
    ne: z.string().optional(),
  }).optional(),
  content: z.object({
    en: z.string().optional(),
    ne: z.string().optional(),
  }).optional(),
  highlightText: z.object({
    en: z.string().optional(),
    ne: z.string().optional(),
  }).optional(),
  image: z.string().optional(),
  displayType: z.enum(['center_popup', 'top_banner']).default('center_popup'),
  popupStyle: z.enum(['standard', 'important', 'promotion', 'minimal', 'image_banner']).default('important'),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  ctaEnabled: z.boolean().default(true),
  ctaText: z.object({
    en: z.string().optional(),
    ne: z.string().optional(),
  }).optional(),
  ctaUrl: z.string().optional(),
  allowDoNotShowAgain: z.boolean().default(true),
  displayFrequency: z.enum(['every_visit', 'once_session', 'once_day', 'once_only']).default('once_session'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  isActive: z.boolean().default(true),
  startAt: z.string().or(z.date()),
  endAt: z.string().or(z.date()),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
