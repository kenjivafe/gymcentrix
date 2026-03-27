import { Request, Response, NextFunction } from 'express';
import { prisma } from '@gymcentrix/db';

export const requireAgentApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required in x-api-key header' });
  }

  try {
    const agent = await prisma.agent.findUnique({
      where: { apiKey }
    });

    if (!agent) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Check if the agent's branch is active based on gym plan
    const branch = await prisma.branch.findUnique({
      where: { id: agent.branchId },
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
      return res.status(404).json({ error: 'Agent branch not found' });
    }

    const gym = (branch as any).gym;
    if (gym.plan !== 'ENTERPRISE') {
      // If a specific branch is designated as active, use that. Otherwise, default to the oldest (primary).
      const activeBranchId = gym.activeBranchId || gym.branches[0]?.id;
      
      if (branch.id !== activeBranchId) {
        return res.status(403).json({ 
          error: 'Branch Service Suspended. This facility is currently inactive under your subscription plan. Adjust your active branch or upgrade to ENTERPRISE.' 
        });
      }
    }

    if (agent.status !== 'ONLINE') {

      await prisma.agent.update({
        where: { id: agent.id },
        data: { status: 'ONLINE', lastSeen: new Date() }
      });
    } else {
      await prisma.agent.update({
        where: { id: agent.id },
        data: { lastSeen: new Date() }
      });
    }

    (req as any).agent = agent;
    next();
  } catch (error) {
    console.error('API Key Auth Error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
