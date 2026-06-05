import express from 'express';
import { getAllExperiences, getExperienceById, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';

const router = express.Router();

router
  .route('/')
  .get(getAllExperiences)
  .post(verifyToken, roleGuard('ADMIN'), createExperience);

router
  .route('/:id')
  .get(getExperienceById)
  .put(verifyToken, roleGuard('ADMIN'), updateExperience)
  .delete(verifyToken, roleGuard('ADMIN'), deleteExperience);

export default router;
