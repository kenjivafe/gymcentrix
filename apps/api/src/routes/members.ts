import { Router } from 'express';
import { prisma } from '@gymcentrix/db';

const router = Router();

// POST /members - add a member
router.post('/', async (req, res) => {
  try {
    const { gymId, branchId, name, rfidUid, membershipStatus, membershipExpiry } = req.body;
    if (!gymId || !branchId || !name) {
      return res.status(400).json({ error: 'gymId, branchId, and name are required' });
    }

    const member = await prisma.member.create({
      data: {
        gymId,
        branchId,
        name,
        rfidUid,
        membershipStatus: membershipStatus || 'ACTIVE',
        membershipExpiry: membershipExpiry ? new Date(membershipExpiry) : null
      }
    });
    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /members - list members
router.get('/', async (req, res) => {
  try {
    const members = await prisma.member.findMany();
    res.json(members);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
