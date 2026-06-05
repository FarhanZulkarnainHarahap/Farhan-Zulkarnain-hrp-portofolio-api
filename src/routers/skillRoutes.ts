import express from 'express';
import * as skill from '../controllers/skillController';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';

const router = express.Router();

router
  .route('/')
  .get(skill.getAllSkills)
  .post(verifyToken, roleGuard('ADMIN'), skill.createSkill);

router
  .route('/:id')
  .delete(verifyToken, roleGuard('ADMIN'), skill.deleteSkill);

export default router;
