import prisma from '@/lib/prisma';

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
    await prisma.auditLog.create({
      data: {
        action,
        performedBy,
        performedByName,
        targetType,
        targetId,
        details: details || {},
        ipAddress: ipAddress || '127.0.0.1',
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
