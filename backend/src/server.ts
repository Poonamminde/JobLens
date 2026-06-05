import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env['PORT'] ?? 5000;
const CLIENT_URL = process.env['CLIENT_URL'] ?? 'http://localhost:5173';

// ─── Database ─────────────────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true, // allow cookies
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'JobLens API is running 🚀' });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 JobLens API running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env['NODE_ENV'] ?? 'development'}\n`);
});

export default app;