import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import competitionRoutes from './routes/competitionRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import referralRoutes from './routes/referralRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/referrals', referralRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', serverTime: new Date().toISOString() });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized Error Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error ${statusCode}]: ${message}`, err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
