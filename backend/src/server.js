import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dns from 'node:dns';
import { fileURLToPath } from 'node:url';
import authRoutes from './auth-routes.js';
import bookingRoutes from './booking-routes.js';
import vehicleRoutes, { favoritesRouter } from './vehicle-routes.js';
import { ApiError } from './middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const uploadsDir = fileURLToPath(new URL('../uploads/', import.meta.url));
app.use('/api/v1/uploads', express.static(uploadsDir, { fallthrough: false, maxAge: '1d' }));

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

app.use('/api/v1', (req, res, next) => {
  if (req.method === 'POST' && req.path === '/auth/logout') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: { code: 'DATABASE_UNAVAILABLE', message: 'MongoDB is unavailable. Start MongoDB and retry.' },
    });
  }
  next();
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/favorites', favoritesRouter);
app.use('/api/v1/bookings', bookingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` }
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const statusCode = err instanceof ApiError
    ? err.statusCode
    : err.code === 11000 ? 409
      : err.name === 'ValidationError' || err.name === 'CastError' ? 400
        : err.name === 'MulterError' ? 400
          : err.statusCode || 500;
  if (statusCode >= 500) console.error('[ERROR]', err.message);
  res.status(statusCode).json({
    success: false,
    error: {
      code: err instanceof ApiError ? err.code : err.code === 11000 ? 'DUPLICATE_RECORD' : err.code || 'INTERNAL_ERROR',
      message: statusCode >= 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    }
  });
});

// Connect to MongoDB and start server
async function start() {
  try {
    const dnsServers = process.env.MONGODB_DNS_SERVERS
      ?.split(',')
      .map((server) => server.trim())
      .filter(Boolean);
    if (dnsServers?.length) dns.setServers(dnsServers);

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rentwheels', { serverSelectionTimeoutMS: 2000 });
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
