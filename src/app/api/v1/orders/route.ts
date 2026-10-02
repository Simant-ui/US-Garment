import { NextRequest } from 'next/server';
import { GET as getOrders, POST as createOrder } from '@/app/api/orders/route';

export async function GET(req: NextRequest) {
  return getOrders(req);
}

export async function POST(req: NextRequest) {
  return createOrder(req);
}
