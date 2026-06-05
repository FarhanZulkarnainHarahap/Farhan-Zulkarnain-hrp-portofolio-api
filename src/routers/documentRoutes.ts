import { Router } from 'express';
import * as doc from '../controllers/documentController';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';
import { docUpload } from '../middleware/upload-middlware';

const router = Router();

router.get('/', doc.getAllDocuments);
router.get('/all', doc.getDocumentsALL);
router.post('/', verifyToken, roleGuard('ADMIN'), docUpload.single('file'), doc.createDocument);
router.delete('/:id', doc.deleteDocument);

export default router;