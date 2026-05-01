import { Router } from 'express';
import { AuthController, loginSchema, registerSchema } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', authMiddleware, AuthController.me);

export default router;
