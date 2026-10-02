import { NextRequest } from 'next/server';
import { GET as getProducts, POST as createProduct } from '@/app/api/products/route';

export async function GET(req: NextRequest) {
  return getProducts(req);
}

export async function POST(req: NextRequest) {
  return createProduct(req);
}
