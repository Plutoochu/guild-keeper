import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserRole,
  toggleUserStatus,
  bulkUserActions
} from '../controllers/usersController';

const router = Router();


router.get('/', authenticate, requireAdmin, getAllUsers);


router.get('/:id', authenticate, getUserById);


router.post('/', authenticate, requireAdmin, createUser);


router.put('/:id', authenticate, updateUser);


router.delete('/:id', authenticate, requireAdmin, deleteUser);


router.put('/:id/toggle-role', authenticate, requireAdmin, toggleUserRole);


router.put('/:id/toggle-status', authenticate, requireAdmin, toggleUserStatus);


router.post('/bulk-actions', authenticate, requireAdmin, bulkUserActions);

export default router; 