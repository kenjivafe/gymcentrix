import { Router } from 'express';
import { prisma } from '@gymcentrix/db';

const router = Router();

// POST /gyms - create a gym
router.post('/', async (req, res) => {
  try {
    const { name, ownerId } = req.body;
    if (!name || !ownerId) {
      return res.status(400).json({ error: 'Name and ownerId are required' });
    }

    const gym = await prisma.gym.create({
      data: { name, ownerId }
    });
    res.status(201).json(gym);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /gyms - list gyms
router.get('/', async (req, res) => {
  try {
    const gyms = await prisma.gym.findMany();
    res.json(gyms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
