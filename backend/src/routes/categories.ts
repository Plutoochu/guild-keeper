import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoriesController';

const router = Router();

router.get('/', getAllCategories);
router.post('/', authenticate, requireAdmin, createCategory);
router.put('/:id', authenticate, requireAdmin, updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router; 