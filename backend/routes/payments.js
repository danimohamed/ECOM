const router = require('express').Router();
const {
  createPaymentIntent,
  stripeWebhook,
  getPayments,
  codPayment,
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/webhook', stripeWebhook);
router.post('/cod', protect, codPayment);
router.get('/', protect, admin, getPayments);

module.exports = router;
