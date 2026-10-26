import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || 'rentwheels-development-access-secret-change-me';

export class ApiError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const asyncRoute = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export function createAccessToken(user) {
  return jwt.sign(
    { role: user.role },
    ACCESS_SECRET,
    { subject: user._id.toString(), expiresIn: '15m', issuer: 'rentwheels-api' },
  );
}

export const requireAuth = asyncRoute(async (req, res, next) => {
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new ApiError(401, 'AUTH_REQUIRED', 'Sign in to continue.');

  try {
    const payload = jwt.verify(token, ACCESS_SECRET, { issuer: 'rentwheels-api' });
    req.auth = { id: payload.sub, role: payload.role };
    next();
  } catch {
    throw new ApiError(401, 'INVALID_TOKEN', 'Your session has expired. Sign in again.');
  }
});

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to do that.'));
    }
    next();
  };
}

export function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || 'rentwheels-development-refresh-secret-change-me';
}