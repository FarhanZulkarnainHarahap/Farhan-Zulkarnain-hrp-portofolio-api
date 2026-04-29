import { Router } from 'express';
import {getProfile, updateProfile, getAllUsers } from '../controllers/user-Controller';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';

const router = Router();


router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.get('/users', verifyToken, roleGuard('ADMIN'), getAllUsers);

export default router;