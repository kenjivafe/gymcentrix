import { Router } from 'express';
import { prisma } from '@gymcentrix/db';

const router = Router();

// GET /attendance - list attendance
router.get('/', async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      include: {
        member: { select: { name: true } },
        agent: { select: { name: true } }
      },
      orderBy: { timestamp: 'desc' }
    });
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
