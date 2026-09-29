import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';

const router = Router();

router.get('/', authMiddleware, authorize(['User', 'Admin']), getProducts);
router.get('/:id', authMiddleware, authorize(['User', 'Admin']), getProductById);
router.post('/', authMiddleware, authorize(['Admin']), createProduct);
router.put('/:id', authMiddleware, authorize(['Admin']), updateProduct);
router.delete('/:id', authMiddleware, authorize(['Admin']), deleteProduct);

export default router;