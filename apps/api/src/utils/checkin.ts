import { prisma } from '@gymcentrix/db';

export interface CheckinResult {
  success: boolean;
  result: 'AUTHORIZED' | 'DENIED';
  reason?: 'UNKNOWN_CARD' | 'BANNED_MEMBER' | 'FROZEN_MEMBERSHIP' | 'EXPIRED_MEMBERSHIP';
  member?: any;
  error?: string;
}

/**
 * Performs the core check-in business logic for an RFID tag.
 * Creates Attendance and AccessLog records.
 */
export async function performCheckin(rfidUid: string, agent: any): Promise<CheckinResult> {
  const member = await prisma.member.findUnique({
    where: { rfidUid }
  });

  // 1. UNKNOWN case
  if (!member) {
    await (prisma as any).accessLog.create({
      data: {
        branchId: agent.branchId,
        agentId: agent.id,
        result: 'DENIED',
        reason: 'UNKNOWN_CARD',
        rfidUid
      }
    });
    return { success: false, result: 'DENIED', reason: 'UNKNOWN_CARD', error: 'Member not found' };
  }

  // 2. DENIED case (Banned/Frozen)
  if (member.membershipStatus === 'BANNED' || member.membershipStatus === 'FROZEN') {
    const reason = member.membershipStatus === 'BANNED' ? 'BANNED_MEMBER' : 'FROZEN_MEMBERSHIP';
    await (prisma as any).accessLog.create({
      data: {
        memberId: member.id,
        branchId: agent.branchId,
        agentId: agent.id,
        result: 'DENIED',
        reason,
        rfidUid
      }
    });
    return { success: false, result: 'DENIED', reason, member, error: `Membership is ${member.membershipStatus}` };
  }

  // 3. EXPIRED case
  const now = new Date();
  if (member.membershipExpiry) {
    const expiry = new Date(member.membershipExpiry);
    expiry.setUTCHours(23, 59, 59, 999);

    if (now > expiry || member.membershipStatus === 'EXPIRED') {
      await prisma.member.update({ 
        where: { id: member.id }, 
        data: { membershipStatus: 'EXPIRED' } 
      });
      await (prisma as any).accessLog.create({
        data: {
          memberId: member.id,
          branchId: agent.branchId,
          agentId: agent.id,
          result: 'DENIED',
          reason: 'EXPIRED_MEMBERSHIP',
          rfidUid
        }
      });
      return { success: false, result: 'DENIED', reason: 'EXPIRED_MEMBERSHIP', member, error: 'Membership expired' };
    }
  }

  // 4. AUTHORIZED case
  await (prisma as any).accessLog.create({
    data: {
      memberId: member.id,
      branchId: agent.branchId,
      agentId: agent.id,
      result: 'AUTHORIZED',
      rfidUid
    }
  });

  await prisma.attendance.create({
    data: {
      memberId: member.id,
      branchId: agent.branchId,
      agentId: agent.id
    }
  });

  return { success: true, result: 'AUTHORIZED', member };
}
