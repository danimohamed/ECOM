const router = require('express').Router();
const {
  createCoupon,
  getCoupons,
  deleteCoupon,
  validateCoupon,
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/auth');

router.post('/validate', protect, validateCoupon);
router.post('/', protect, admin, createCoupon);
router.get('/', protect, admin, getCoupons);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
