import { Router } from 'express';
import * as skill from '../controllers/skillController';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';

const router = Router();

router.get('/', skill.getAllSkills);

router.post('/', verifyToken, roleGuard('ADMIN'), skill.createSkill);

router.delete('/:id', verifyToken, roleGuard('ADMIN'), skill.deleteSkill);

export default router;