import { Router } from 'express';
import { prisma } from '@gymcentrix/db';
import { requireAgentApiKey } from '../middlewares/auth';

const router = Router();

import { performCheckin } from '../utils/checkin';

// POST /rfid/checkin - agent sends UID to check in member
router.post('/checkin', requireAgentApiKey, async (req, res) => {
  try {
    const { rfidUid } = req.body;
    const agent = (req as any).agent;

    if (!rfidUid) {
      return res.status(400).json({ error: 'rfidUid is required' });
    }

    const checkinResult = await performCheckin(rfidUid, agent);

    // BUNDLE RESULT INTO BRANCH STATE (for global relay to Kiosks)
    const eventPayload = {
      tagId: rfidUid,
      result: checkinResult.result,
      reason: checkinResult.reason,
      name: checkinResult.member?.name || (checkinResult.reason === 'UNKNOWN_CARD' ? 'Unknown' : 'Member'),
      timestamp: Date.now()
    };

    await prisma.branch.update({
      where: { id: agent.branchId },
      data: {
        lastScanId: JSON.stringify(eventPayload),
        lastScanTime: new Date()
      }
    });

    res.status(checkinResult.success ? 201 : (checkinResult.reason === 'UNKNOWN_CARD' ? 404 : 403)).json(checkinResult);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
