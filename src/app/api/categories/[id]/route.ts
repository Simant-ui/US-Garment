import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

    const { id } = await params;

    const existingCategory = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingCategory) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    await prisma.category.delete({
      where: { id: existingCategory.id },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Delete category error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existingCategory = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingCategory) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: existingCategory.id },
      data: body,
    });

    return NextResponse.json({ success: true, message: 'Category updated successfully', category: updatedCategory });
  } catch (error: any) {
    console.error('Update category error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server Error' }, { status: 500 });
  }
}
