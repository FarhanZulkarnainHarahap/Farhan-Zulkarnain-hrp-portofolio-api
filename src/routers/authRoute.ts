import express from 'express';
import { register, login, logout } from '../controllers/user-Controller';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);

export default router;
