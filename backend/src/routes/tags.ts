import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag
} from '../controllers/tagsController';

const router = Router();

router.get('/', getAllTags);
router.post('/', authenticate, requireAdmin, createTag);
router.put('/:id', authenticate, requireAdmin, updateTag);
router.delete('/:id', authenticate, requireAdmin, deleteTag);

export default router; 