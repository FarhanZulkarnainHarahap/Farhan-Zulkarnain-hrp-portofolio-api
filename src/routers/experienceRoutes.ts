import { Router } from 'express';
import { getAllExperiences, getExperienceById, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';

const router = Router();

router.get('/', getAllExperiences);
router.get('/:id', getExperienceById);
router.post('/', verifyToken, roleGuard('ADMIN'), createExperience);
router.put('/:id', verifyToken, roleGuard('ADMIN'), updateExperience);
router.delete('/:id', verifyToken, roleGuard('ADMIN'), deleteExperience);

export default router;