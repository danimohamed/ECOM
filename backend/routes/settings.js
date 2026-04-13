const router = require('express').Router();
const {
  getSiteSettings,
  updateSiteSettings,
  subscribe,
  getSubscribers,
} = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getSiteSettings);
router.put('/', protect, admin, updateSiteSettings);
router.post('/subscribe', subscribe);
router.get('/subscribers', protect, admin, getSubscribers);

module.exports = router;
