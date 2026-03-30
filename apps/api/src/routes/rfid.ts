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
      await (prisma as any).accessLog.create({
        data: {
          branchId: agent.branchId,
          agentId: agent.id,
          status: 'UNKNOWN',
          rfidUid
        }
      });
      return res.status(404).json({ error: 'Member not found with this RFID' });
    }

    // 2. DENIED case (Member exists but is Banned/Inactive/Frozen)
    if (member.membershipStatus !== 'ACTIVE' && member.membershipStatus !== 'EXPIRED') {
      await (prisma as any).accessLog.create({
        data: {
          memberId: member.id,
          branchId: agent.branchId,
          agentId: agent.id,
          status: 'DENIED',
          rfidUid
        }
      });
      return res.status(403).json({ error: 'Membership is not active', status: member.membershipStatus });
    }

    // 3. EXPIRED case (Member pass has run its course)
    if (member.membershipExpiry) {
      const now = new Date();
      const expiry = new Date(member.membershipExpiry);
      expiry.setUTCHours(23, 59, 59, 999);

      if (now > expiry) {
        await prisma.member.update({ where: { id: member.id }, data: { membershipStatus: 'EXPIRED' } });
        await (prisma as any).accessLog.create({
          data: {
            memberId: member.id,
            branchId: agent.branchId,
            agentId: agent.id,
            status: 'EXPIRED',
            rfidUid
          }
        });
        return res.status(403).json({ error: 'Membership expired' });
      }
    }

    // 4. AUTHORIZED case (Success)
    // Log the visit attempt
    await (prisma as any).accessLog.create({
      data: {
        memberId: member.id,
        branchId: agent.branchId,
        agentId: agent.id,
        status: 'AUTHORIZED',
        rfidUid
      }
    });

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
