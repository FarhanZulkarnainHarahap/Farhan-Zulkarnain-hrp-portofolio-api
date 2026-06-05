import express from 'express';
import * as doc from '../controllers/documentController';
import { verifyToken, roleGuard } from '../middleware/auth-middleware';
import { docUpload } from '../middleware/upload-middlware';

const router = express.Router();

router
  .route('/')
  .get(doc.getAllDocuments)
  .post(verifyToken, roleGuard('ADMIN'), docUpload.single('file'), doc.createDocument);

router.route('/all').get(doc.getDocumentsALL);
router.route('/:id').delete(doc.deleteDocument);

export default router;
