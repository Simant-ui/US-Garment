import React from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import OrderSuccessPageClient from './OrderSuccessPageClient';

interface OrderSuccessProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderId } = await params;
  await connectDB();

  const order = await Order.findById(orderId).lean();
  if (!order) {
    notFound();
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return <OrderSuccessPageClient order={serialize(order)} />;
}
