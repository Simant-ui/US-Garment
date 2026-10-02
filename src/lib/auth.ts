import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.AUTH_SECRET || 'garment_us_super_secret_jwt_key_2026';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'STAFF';
  iat?: number;
  exp?: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function signToken(payload: TokenPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest): Promise<TokenPayload | null> {
  let token: string | undefined;

  if (req) {
    // Check Authorization Header or Cookie
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = req.cookies.get('garment_token')?.value || req.cookies.get('garment_admin_token')?.value;
    }
  } else {
    // Read from next/headers cookies
    const cookieStore = await cookies();
    token = cookieStore.get('garment_token')?.value || cookieStore.get('garment_admin_token')?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}

export async function getAdminUser(req?: NextRequest): Promise<TokenPayload | null> {
  const user = await getSessionUser(req);
  if (!user) return null;
  if (['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'].includes(user.role)) {
    return user;
  }
  return null;
}

export function requireAdmin(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const admin = await getAdminUser(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized Admin Access' }, { status: 401 });
    }
    return handler(req, admin, ...args);
  };
}
