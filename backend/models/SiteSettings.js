const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteMode: {
    type: String,
    enum: ['live', 'coming-soon', 'maintenance'],
    default: 'live',
  },
  brandStory: {
    type: String,
    default: '',
  },
  launchDate: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
