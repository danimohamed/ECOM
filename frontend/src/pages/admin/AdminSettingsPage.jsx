import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSiteSettings, updateSiteSettings, fetchSubscribers } from '../../store/settingsSlice';
import { HiOutlineGlobe, HiOutlineClock, HiOutlineExclamation, HiOutlineMail, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';

const modes = [
  { value: 'live', label: 'Live', icon: <HiOutlineGlobe size={20} />, desc: 'Site is fully accessible to all visitors' },
  { value: 'coming-soon', label: 'Coming Soon', icon: <HiOutlineClock size={20} />, desc: 'Shows a coming soon page with email subscription' },
  { value: 'maintenance', label: 'Maintenance', icon: <HiOutlineExclamation size={20} />, desc: 'Shows a maintenance page to all visitors' },
];

const AdminSettingsPage = () => {
  const dispatch = useDispatch();
  const { siteMode, brandStory, launchDate, subscribers } = useSelector(s => s.settings);
  const [mode, setMode] = useState(siteMode);
  const [story, setStory] = useState(brandStory);
  const [launch, setLaunch] = useState(launchDate ? launchDate.slice(0, 16) : '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchSiteSettings());
    dispatch(fetchSubscribers());
  }, [dispatch]);

  useEffect(() => {
    setMode(siteMode);
    setStory(brandStory);
    setLaunch(launchDate ? launchDate.slice(0, 16) : '');
  }, [siteMode, brandStory, launchDate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(updateSiteSettings({ siteMode: mode, brandStory: story, launchDate: launch || null })).unwrap();
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err || 'Failed to save');
    }
    setSaving(false);
  };

  const exportSubscribers = () => {
    if (!subscribers.length) return;
    const csv = 'Email,Date\n' + subscribers.map(s =>
      `${s.email},${new Date(s.createdAt).toLocaleDateString()}`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Site Settings</h1>
      </div>

      {siteMode !== 'live' && (
        <div className="settings-notice">
          Your site is currently in <strong>{siteMode === 'coming-soon' ? 'Coming Soon' : 'Maintenance'}</strong> mode.
          Visitors will see the {siteMode === 'coming-soon' ? 'coming soon' : 'maintenance'} page.
          As an admin, you can still browse the site normally.
        </div>
      )}

      {/* Site Mode */}
      <div className="settings-section">
        <h3 className="settings-section-title">Site Mode</h3>
        <div className="site-mode-grid">
          {modes.map(m => (
            <button
              key={m.value}
              className={`site-mode-card${mode === m.value ? ' active' : ''}`}
              onClick={() => setMode(m.value)}
            >
              <div className="site-mode-icon">{m.icon}</div>
              <div className="site-mode-label">{m.label}</div>
              <div className="site-mode-desc">{m.desc}</div>
              {mode === m.value && <div className="site-mode-badge">Active</div>}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Story (for Coming Soon page) */}
      <div className="settings-section">
        <h3 className="settings-section-title">Brand Story</h3>
        <p className="settings-hint">This text appears on the Coming Soon page below the email subscription.</p>
        <textarea
          className="settings-textarea"
          rows={4}
          value={story}
          onChange={e => setStory(e.target.value)}
          placeholder="Tell your brand story..."
        />
      </div>

      {/* Launch Date */}
      <div className="settings-section">
        <h3 className="settings-section-title">Launch Date</h3>
        <p className="settings-hint">Set a countdown timer on the Coming Soon page. Leave empty to hide the timer.</p>
        <input
          type="datetime-local"
          className="settings-input"
          value={launch}
          onChange={e => setLaunch(e.target.value)}
        />
      </div>

      <button className="admin-btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </button>

      {/* Subscribers list */}
      <div className="settings-section" style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 className="settings-section-title" style={{ margin: 0 }}>
            <HiOutlineMail size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Email Subscribers ({subscribers.length})
          </h3>
          {subscribers.length > 0 && (
            <button className="admin-btn-primary" style={{ padding: '8px 18px', fontSize: 12 }} onClick={exportSubscribers}>
              <HiOutlineDownload size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Export CSV
            </button>
          )}
        </div>
        {subscribers.length === 0 ? (
          <p style={{ color: '#888', fontSize: 14 }}>No subscribers yet</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Email</th><th>Date</th></tr>
              </thead>
              <tbody>
                {subscribers.map(s => (
                  <tr key={s._id}>
                    <td>{s.email}</td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
