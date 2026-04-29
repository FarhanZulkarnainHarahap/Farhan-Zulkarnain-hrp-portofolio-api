import { Router } from 'express';
import * as porto from '../controllers/portfolioController';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';
import { uploadImage } from '../middleware/upload-middlware';

const router = Router();


router.get('/', porto.getAllPortfolios);
router.get('/portofolios/:id', porto.getPortfolioById);
router.post('/',verifyToken, roleGuard('ADMIN'), uploadImage.single('image'), porto.createPortfolio);
router.put('/portofolios/:id',verifyToken, roleGuard('ADMIN'), uploadImage.single('image'), porto.updatePortfolio);
router.delete('/:id', porto.deletePortfolio);

export default router;