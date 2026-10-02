import { NextResponse } from 'next/server';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export function successResponse(
  data: any = null,
  message?: string,
  status: number = 200,
  pagination?: PaginationMeta
) {
  const body: any = { success: true };
  if (message) body.message = message;
  if (data !== null && data !== undefined) body.data = data;
  if (pagination) body.pagination = pagination;
  return NextResponse.json(body, { status });
}

export function errorResponse(
  message: string = 'Internal Server Error',
  status: number = 400,
  errors?: any
) {
  const body: any = { success: false, message };
  if (errors) body.errors = errors;
  return NextResponse.json(body, { status });
}
