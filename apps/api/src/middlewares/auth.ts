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
