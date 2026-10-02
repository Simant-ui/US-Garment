import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid mobile number is required'),
  email: z.string().email('Valid email address is required'),
  province: z.string().min(1, 'Please select a province'),
  district: z.string().min(1, 'Please select a district'),
  city: z.string().min(2, 'City / Municipality is required'),
  addressLine: z.string().min(3, 'Address line is required'),
  landmark: z.string().optional(),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'ONLINE_GATEWAY', 'ESewa', 'Khalti']),
  couponCode: z.string().optional(),
  orderNotes: z.string().optional(),
});
