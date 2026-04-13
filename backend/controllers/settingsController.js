const SiteSettings = require('../models/SiteSettings');
const Subscriber = require('../models/Subscriber');

// Helper: get or create singleton settings
const getSettings = async () => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({ siteMode: 'live', brandStory: '' });
  }
  return settings;
};

// GET /api/settings — public (frontend needs to know the mode)
exports.getSiteSettings = async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/settings — admin only
exports.updateSiteSettings = async (req, res) => {
  try {
    const { siteMode, brandStory, launchDate } = req.body;
    const settings = await getSettings();
    if (siteMode) settings.siteMode = siteMode;
    if (brandStory !== undefined) settings.brandStory = brandStory;
    if (launchDate !== undefined) settings.launchDate = launchDate;
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/settings/subscribe — public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const exists = await Subscriber.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Already subscribed' });

    await Subscriber.create({ email });
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already subscribed' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/settings/subscribers — admin only
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
