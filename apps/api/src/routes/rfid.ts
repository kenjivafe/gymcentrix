import { Router } from 'express';
import { prisma } from '@gymcentrix/db';
import { requireAgentApiKey } from '../middlewares/auth';

const router = Router();

// POST /rfid/checkin - agent sends UID to check in member
router.post('/checkin', requireAgentApiKey, async (req, res) => {
  try {
    const { rfidUid } = req.body;
    const agent = (req as any).agent; // set by middleware

    if (!rfidUid) {
      return res.status(400).json({ error: 'rfidUid is required' });
    }

    const member = await prisma.member.findUnique({
      where: { rfidUid }
    });

    // 1. UNKNOWN case (Tag doesn't belong to any member)
    if (!member) {
      const log = await (prisma as any).accessLog.create({
        data: {
          branchId: agent.branchId,
          agentId: agent.id,
          result: 'DENIED',
          reason: 'UNKNOWN_CARD',
          rfidUid
        }
      });
      console.log(`[RFID API] Unknown card detected: ${rfidUid}`, log.id);
      return res.status(404).json({ 
        error: 'Member not found with this RFID',
        result: 'DENIED',
        reason: 'UNKNOWN_CARD'
      });
    }

    // 2. DENIED case (Member exists but is Banned/Frozen)
    if (member.membershipStatus === 'BANNED' || member.membershipStatus === 'FROZEN') {
      const reason = member.membershipStatus === 'BANNED' ? 'BANNED_MEMBER' : 'FROZEN_MEMBERSHIP';
      const log = await (prisma as any).accessLog.create({
        data: {
          memberId: member.id,
          branchId: agent.branchId,
          agentId: agent.id,
          result: 'DENIED',
          reason,
          rfidUid
        }
      });
      console.log(`[RFID API] Access denied for member ${member.name} (Status: ${member.membershipStatus})`, log.id);
      return res.status(403).json({ 
        error: `Membership is ${member.membershipStatus}`,
        result: 'DENIED',
        reason
      });
    }

    // 3. EXPIRED case (Member pass has run its course)
    const now = new Date();
    if (member.membershipExpiry) {
      const expiry = new Date(member.membershipExpiry);
      expiry.setUTCHours(23, 59, 59, 999);

      if (now > expiry || member.membershipStatus === 'EXPIRED') {
        await prisma.member.update({ where: { id: member.id }, data: { membershipStatus: 'EXPIRED' } });
        const log = await (prisma as any).accessLog.create({
          data: {
            memberId: member.id,
            branchId: agent.branchId,
            agentId: agent.id,
            result: 'DENIED',
            reason: 'EXPIRED_MEMBERSHIP',
            rfidUid
          }
        });
        console.log(`[RFID API] Expired membership for ${member.name}`, log.id);
        return res.status(403).json({ 
          error: 'Membership expired', 
          result: 'DENIED',
          reason: 'EXPIRED_MEMBERSHIP'
        });
      }
    }

    // 4. AUTHORIZED case (Success)
    // Log the visit attempt
    const log = await (prisma as any).accessLog.create({
      data: {
        memberId: member.id,
        branchId: agent.branchId,
        agentId: agent.id,
        status: 'AUTHORIZED',
        rfidUid
      }
    });
    console.log(`[RFID API] Access authorized for member ${member.name}`, log.id);

    // Record the actual attendance metric
    const attendance = await prisma.attendance.create({
      data: {
        memberId: member.id,
        branchId: agent.branchId,
        agentId: agent.id
      }
    });

    res.status(201).json({ success: true, member, attendance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
