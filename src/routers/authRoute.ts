import { Router } from 'express';
import { register, login, logout } from '../controllers/user-Controller';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);

export default router;