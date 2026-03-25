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

    if (!member) {
      return res.status(404).json({ error: 'Member not found with this RFID' });
    }

    if (member.membershipStatus !== 'ACTIVE') {
      return res.status(403).json({ error: 'Membership is not active', status: member.membershipStatus });
    }

    if (member.membershipExpiry && new Date() > member.membershipExpiry) {
      await prisma.member.update({ where: { id: member.id }, data: { membershipStatus: 'EXPIRED' } });
      return res.status(403).json({ error: 'Membership expired' });
    }

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
