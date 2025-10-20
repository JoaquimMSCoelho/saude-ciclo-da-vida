// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// 🔐 Rota protegida
router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Acesso autorizado', userId: (req as any).userId });
});

export default router;
