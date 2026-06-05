import express from 'express';
import {getProfile, updateProfile, getAllUsers } from '../controllers/user-Controller';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';

const router = express.Router();

router
  .route('/profile')
  .get(verifyToken, getProfile)
  .put(verifyToken, updateProfile);

router
  .route('/users')
  .get(verifyToken, roleGuard('ADMIN'), getAllUsers);

export default router;
