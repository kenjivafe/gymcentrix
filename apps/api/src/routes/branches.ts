import { Router } from 'express';
import { prisma } from '@gymcentrix/db';

const router = Router();

// POST /branches - create a branch
router.post('/', async (req, res) => {
  try {
    const { gymId, name, address } = req.body;
    if (!gymId || !name) {
      return res.status(400).json({ error: 'gymId and name are required' });
    }

    const branch = await prisma.branch.create({
      data: { gymId, name, address }
    });
    res.status(201).json(branch);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /branches - list branches
router.get('/', async (req, res) => {
  try {
    const branches = await prisma.branch.findMany();
    res.json(branches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
