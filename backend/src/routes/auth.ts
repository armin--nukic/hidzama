import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/jwt.js';
import { loginSchema } from '../lib/validators.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return next(error);
  }
});

authRouter.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});
