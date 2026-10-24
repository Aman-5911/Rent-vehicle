import { randomUUID, createHash } from 'node:crypto';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Router } from 'express';
import { User } from './models.js';
import { ApiError, asyncRoute, createAccessToken, getRefreshSecret, requireAuth } from './middleware.js';

const router = Router();
const COOKIE_NAME = 'rentwheels_refresh';
const REFRESH_DAYS = 7;

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function publicUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    favorites: user.favorites,
    createdAt: user.createdAt,
  };
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
  };
}

async function createSession(user, res) {
  const refreshToken = jwt.sign(
    { type: 'refresh' },
    getRefreshSecret(),
    { subject: user._id.toString(), jwtid: randomUUID(), expiresIn: `${REFRESH_DAYS}d`, issuer: 'rentwheels-api' },
  );

  user.refreshSessions = user.refreshSessions.filter((session) => session.expiresAt > new Date());
  user.refreshSessions.push({
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000),
  });
  user.refreshSessions = user.refreshSessions.slice(-5);
  await user.save();
  res.cookie(COOKIE_NAME, refreshToken, refreshCookieOptions());

  return { accessToken: createAccessToken(user), user: publicUser(user) };
}

router.post('/register', asyncRoute(async (req, res) => {
  const { fullName, email, phone, password, role = 'customer' } = req.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const cleanName = typeof fullName === 'string' ? fullName.trim() : '';

  if (cleanName.length < 2 || cleanName.length > 100) {
    throw new ApiError(400, 'INVALID_NAME', 'Enter your full name.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new ApiError(400, 'INVALID_EMAIL', 'Enter a valid email address.');
  }
  if (!/^(?:\+91\s?)?[6-9]\d{9}$/.test(String(phone || '').replace(/[\s-]/g, ''))) {
    throw new ApiError(400, 'INVALID_PHONE', 'Enter a valid Indian mobile number.');
  }
  if (typeof password !== 'string' || password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    throw new ApiError(400, 'WEAK_PASSWORD', 'Use 8+ characters with uppercase, lowercase, a number, and a symbol.');
  }
  if (!['customer', 'owner'].includes(role)) {
    throw new ApiError(400, 'INVALID_ROLE', 'Choose customer or owner registration.');
  }
  if (await User.exists({ email: normalizedEmail })) {
    throw new ApiError(409, 'EMAIL_IN_USE', 'An account with this email already exists.');
  }

  const user = await User.create({
    fullName: cleanName,
    email: normalizedEmail,
    phone: String(phone).replace(/[\s-]/g, ''),
    role,
    passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
  });
  const session = await createSession(user, res);
  res.status(201).json({ success: true, data: session });
}));

router.post('/login', asyncRoute(async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user || !await argon2.verify(user.passwordHash, password)) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  }

  const session = await createSession(user, res);
  res.json({ success: true, data: session });
}));

router.post('/refresh', asyncRoute(async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw new ApiError(401, 'REFRESH_REQUIRED', 'Sign in to continue.');

  let payload;
  try {
    payload = jwt.verify(token, getRefreshSecret(), { issuer: 'rentwheels-api' });
  } catch {
    res.clearCookie(COOKIE_NAME, refreshCookieOptions());
    throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Your session has expired. Sign in again.');
  }

  const tokenHash = hashToken(token);
  const user = await User.findOne({ _id: payload.sub, 'refreshSessions.tokenHash': tokenHash });
  if (!user) {
    res.clearCookie(COOKIE_NAME, refreshCookieOptions());
    throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Your session has expired. Sign in again.');
  }

  user.refreshSessions = user.refreshSessions.filter((session) => session.tokenHash !== tokenHash);
  const session = await createSession(user, res);
  res.json({ success: true, data: session });
}));

router.post('/logout', asyncRoute(async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (token && mongoose.connection.readyState === 1) {
    const payload = jwt.decode(token);
    if (payload?.sub) {
      await User.updateOne(
        { _id: payload.sub },
        { $pull: { refreshSessions: { tokenHash: hashToken(token) } } },
      );
    }
  }
  res.clearCookie(COOKIE_NAME, refreshCookieOptions());
  res.json({ success: true, data: { loggedOut: true } });
}));

router.get('/me', requireAuth, asyncRoute(async (req, res) => {
  const user = await User.findById(req.auth.id);
  if (!user) throw new ApiError(401, 'USER_NOT_FOUND', 'This account is no longer available.');
  res.json({ success: true, data: { user: publicUser(user) } });
}));

export default router;