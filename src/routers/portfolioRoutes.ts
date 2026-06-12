import express from 'express';
import * as porto from '../controllers/portfolioController';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';
import { uploadImage } from '../middleware/upload-middlware';

const router = express.Router();

router
  .route('/')
  .get(porto.getAllPortfolios)
  .post(verifyToken, roleGuard('ADMIN'), uploadImage.single('image'), porto.createPortfolio);

router
  .route('/:id')
  .get(porto.getPortfolioById)
  .put(verifyToken, roleGuard('ADMIN'), uploadImage.single('image'), porto.updatePortfolio);

router.route('/:id').delete(porto.deletePortfolio);

export default router;
