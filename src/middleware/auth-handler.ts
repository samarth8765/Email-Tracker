import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';

export const AuthMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, 'accessToken');
  if (!token) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  try {
    const payload = jwt.verify(token, Bun.env.JWT_SECRET as string);
    c.set('userId', payload);
    await next();
  } catch (err) {
    return c.json({ message: 'Unauthorized' }, 401);
  }
};
