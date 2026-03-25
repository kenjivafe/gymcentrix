import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import gymsRouter from './routes/gyms';
import branchesRouter from './routes/branches';
import membersRouter from './routes/members';
import agentsRouter from './routes/agents';
import rfidRouter from './routes/rfid';
import attendanceRouter from './routes/attendance';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// Register API Routes
app.use('/gyms', gymsRouter);
app.use('/branches', branchesRouter);
app.use('/members', membersRouter);
app.use('/agents', agentsRouter);
app.use('/rfid', rfidRouter);
app.use('/attendance', attendanceRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[Gymcentrix API] Server is running on port ${PORT}`);
});
