import { z } from 'zod';

export const customOrderSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  mobileNumber: z.string().min(10, 'Valid 10-digit mobile number is required'),
  email: z.string().email('Valid email address is required'),
  garmentType: z.string().min(1, 'Please select a garment type'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  size: z.string().optional(),
  color: z.string().optional(),
  fabricPreference: z.string().optional(),
  designRequirement: z.string().min(10, 'Please detail your design requirements'),
  deliveryLocation: z.string().min(3, 'Delivery city or address is required'),
  requiredDate: z.string().optional(),
  additionalMessage: z.string().optional(),
  referenceImages: z.array(z.string()).optional(),
});
