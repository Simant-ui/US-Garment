import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import OrderSuccessPageClient from './OrderSuccessPageClient';

interface OrderSuccessProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderId } = await params;

  if (!orderId || orderId === 'undefined') {
    notFound();
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

  return <OrderSuccessPageClient order={serialize(order)} />;
}
