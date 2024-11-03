import { Hono } from 'hono';
import { AuthService } from '@/src/auth/auth';
import { AuthMiddleware } from '../middleware/auth-handler';

export const AuthRouter = new Hono();

AuthRouter.get('/get-me', AuthMiddleware, AuthService.GetMe);
AuthRouter.post('/signup', AuthService.SignUp);
AuthRouter.post('/login', AuthService.Login);
AuthRouter.post('/refresh-access-token', AuthService.RefreshAccessToken);
AuthRouter.post('/logout', AuthMiddleware, AuthService.Logout);
