import { z } from 'zod';

export const wholesaleInquirySchema = z.object({
  organizationName: z.string().min(2, 'Organization or Business name is required'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required'),
  productType: z.string().min(1, 'Please specify product requirement'),
  estimatedQuantity: z.number().min(10, 'Wholesale minimum requirement is 10 units'),
  budgetRange: z.string().optional(),
  requiredDate: z.string().optional(),
  location: z.string().min(3, 'Location or City is required'),
  description: z.string().min(10, 'Please describe your bulk order requirements'),
});
