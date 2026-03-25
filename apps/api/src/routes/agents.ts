import { Router } from 'express';
import { prisma } from '@gymcentrix/db';
import crypto from 'crypto';

const router = Router();

// POST /agents/register - register an RFID agent
router.post('/register', async (req, res) => {
  try {
    const { branchId, name } = req.body;
    if (!branchId || !name) {
      return res.status(400).json({ error: 'branchId and name are required' });
    }

    const apiKey = crypto.randomBytes(32).toString('hex');

    const agent = await prisma.agent.create({
      data: { branchId, name, apiKey }
    });
    
    res.status(201).json({ agent, apiKey });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
