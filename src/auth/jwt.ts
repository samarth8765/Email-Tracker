import jwt from 'jsonwebtoken';

const JWT_SECRET = Bun.env.JWT_SECRET;

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: '7d' });
};
