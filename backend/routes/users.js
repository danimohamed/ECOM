const router = require('express').Router();
const {
  getUsers,
  deleteUser,
  updateUserRole,
  updateProfile,
  getUserCount,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.get('/count', protect, admin, getUserCount);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;
