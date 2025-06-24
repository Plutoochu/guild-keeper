import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { uploadProfileImage } from '../middleware/upload';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  deleteOwnAccount,
  toggleUserRole,
  toggleUserStatus,
  bulkUserActions,
  uploadUserProfileImage,
  deleteUserProfileImage
} from '../controllers/usersController';

const router = Router();

router.get('/', authenticate, requireAdmin, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.post('/', authenticate, requireAdmin, createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, requireAdmin, deleteUser);
router.delete('/me/account', authenticate, deleteOwnAccount);
router.put('/:id/toggle-role', authenticate, requireAdmin, toggleUserRole);
router.put('/:id/toggle-status', authenticate, requireAdmin, toggleUserStatus);
router.post('/bulk-actions', authenticate, requireAdmin, bulkUserActions);

router.post('/profile-image', authenticate, uploadProfileImage, uploadUserProfileImage);

router.post('/:id/profile-image', authenticate, uploadProfileImage, uploadUserProfileImage);

router.delete('/profile-image', authenticate, deleteUserProfileImage);

router.delete('/:id/profile-image', authenticate, deleteUserProfileImage);

export default router; 