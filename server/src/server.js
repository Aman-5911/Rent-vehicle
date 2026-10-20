import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/v1/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV,
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` }
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    }
  });
});

// Connect to MongoDB and start server
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️  MongoDB not available — running in offline/demo mode:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 RentWheels API running at http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/v1/health`);
  });
}

start();
