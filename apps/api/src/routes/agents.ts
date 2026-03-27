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

    // Check if branch is eligible for new agents based on gym plan
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        gym: {
          include: {
            branches: {
              orderBy: { createdAt: 'asc' },
              select: { id: true }
            }
          }
        }
      }
    });

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    const gym = (branch as any).gym;
    if (gym.plan !== 'ENTERPRISE') {
      // If a specific branch is designated as active, use that. Otherwise, default to the oldest (primary).
      const activeBranchId = (gym as any).activeBranchId || gym.branches[0]?.id;
      
      if (branch.id !== activeBranchId) {
        return res.status(403).json({ 
          error: 'Registration Blocked. New biometric agents can only be deployed to the active branch. Adjust your active branch in settings or upgrade to ENTERPRISE.' 
        });
      }
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
