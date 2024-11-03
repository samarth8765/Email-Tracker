import type { Context } from 'hono';
import { DBClient } from '@/prisma';
import bcrypt from 'bcrypt';
import { Snowflake } from '@theinternetfolks/snowflake';
import { generateAccessToken, generateRefreshToken } from '@/src/auth/jwt';
import redis from '@/utils/redis';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';

const dbClient = DBClient.getInstance();

const GetMe = async (c: Context) => {
  const { userId } = c.get('userId');

  const getUser = await redis.get(`user:${userId}`);

  if (getUser) {
    return c.json(JSON.parse(getUser));
  }

  const user = await dbClient.user.findUnique({
    where: {
      id: userId
    }
  });

  return c.json(user);
};

const SignUp = async (c: Context) => {
  const { first_name, last_name, email, password } = await c.req.json();

  const userExists = await dbClient.user.findFirst({
    where: {
      email
    }
  });

  if (userExists) {
    return c.json({ message: 'User already exists' }, 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await dbClient.user.create({
    data: {
      id: Snowflake.generate({ timestamp: Date.now() }),
      email,
      first_name,
      last_name,
      password: hashedPassword
    }
  });

  return c.json({ message: 'User created successfully' });
};

const Login = async (c: Context) => {
  const { email, password } = await c.req.json();

  const user = await dbClient.user.findFirst({
    where: {
      email
    }
  });

  if (!user) {
    return c.json({ message: 'User not found' }, 400);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return c.json({ message: 'Incorrect password' }, 400);
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await redis.setex(`refreshToken:${user.id}`, 604800, refreshToken);
  await redis.set(`user:${user.id}`, JSON.stringify(user));

  setCookie(c, 'accessToken', accessToken, {
    httpOnly: true,
    maxAge: 15 * 60
  });

  setCookie(c, 'refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    path: '/v1/api/auth/refresh-access-token'
  });

  return c.json({
    message: 'Login successful'
  });
};

const RefreshAccessToken = async (c: Context) => {
  const refreshToken = getCookie(c, 'refreshToken');
  if (!refreshToken) {
    return c.json({ message: 'Refresh token not found' }, 401);
  }

  const { userId } = jwt.verify(refreshToken, Bun.env.JWT_SECRET as string) as {
    userId: string;
  };

  const storedToken = await redis.get(`refreshToken:${userId}`);
  if (storedToken !== refreshToken) {
    return c.json(
      { message: 'Refresh token not found. Please login again' },
      401
    );
  }

  const accessToken = generateAccessToken(userId as string);
  setCookie(c, 'accessToken', accessToken, {
    httpOnly: true,
    maxAge: 15 * 60
  });

  return c.json({
    message: 'Access Token refreshed successfully'
  });
};

const Logout = async (c: Context) => {
  const userId = c.get('userId');

  await redis.del(`refreshToken:${userId}`);
  await redis.del(`user:${userId}`);

  deleteCookie(c, 'accessToken');
  deleteCookie(c, 'refreshToken');

  return c.json({
    message: 'Logout successful'
  });
};

export const AuthService = {
  GetMe,
  SignUp,
  Login,
  RefreshAccessToken,
  Logout
};
