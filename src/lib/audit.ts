import AuditLog from '@/models/AuditLog';
import { connectDB } from '@/lib/mongodb';

export async function createAuditLog({
  action,
  performedBy,
  performedByName,
  targetType,
  targetId,
  details,
  ipAddress,
}: {
  action: string;
  performedBy: string;
  performedByName: string;
  targetType: string;
  targetId: string;
  details?: Record<string, any>;
  ipAddress?: string;
}) {
  try {
    await connectDB();
    await AuditLog.create({
      action,
      performedBy,
      performedByName,
      targetType,
      targetId,
      details: details || {},
      ipAddress: ipAddress || '127.0.0.1',
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
