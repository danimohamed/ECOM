import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminCoupons, createCoupon, deleteCoupon } from '../../store/adminSlice';

const AdminCouponsPage = () => {
  const dispatch = useDispatch();
  const { coupons } = useSelector((state) => state.admin);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '', discountType: 'percentage', discountValue: '',
    minPurchase: '', maxUses: '', expiresAt: '',
  });

  useEffect(() => {
    dispatch(fetchAdminCoupons());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCoupon({
      ...form,
      discountValue: Number(form.discountValue),
      minPurchase: Number(form.minPurchase) || 0,
      maxUses: Number(form.maxUses) || null,
    }));
    setForm({ code: '', discountType: 'percentage', discountValue: '', minPurchase: '', maxUses: '', expiresAt: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this coupon?')) {
      dispatch(deleteCoupon(id));
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Coupons</h1>
        <button className="btn btn-dark" onClick={() => setShowForm(true)}>+ Create Coupon</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-content" style={{ position: 'relative' }}>
            <h2>Create Coupon</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Code</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required placeholder="e.g. OPPA20" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Type</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount (€)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Value</label>
                  <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Min Purchase (€)</label>
                  <input type="number" value={form.minPurchase} onChange={(e) => setForm({ ...form, minPurchase: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Expires At</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-dark">Create</button>
                <button type="button" className="btn btn-ghost" style={{ color: '#000', borderColor: '#000' }} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Min Purchase</th>
            <th>Used</th>
            <th>Expires</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c._id}>
              <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.code}</td>
              <td>{c.discountType}</td>
              <td>{c.discountType === 'percentage' ? `${c.discountValue}%` : `€${c.discountValue}`}</td>
              <td>€{c.minPurchase}</td>
              <td>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
              <td>{new Date(c.expiresAt).toLocaleDateString()}</td>
              <td>
                <span className={`status-badge ${c.isActive && new Date(c.expiresAt) > new Date() ? 'paid' : 'cancelled'}`}>
                  {c.isActive && new Date(c.expiresAt) > new Date() ? 'ACTIVE' : 'EXPIRED'}
                </span>
              </td>
              <td>
                <button onClick={() => handleDelete(c._id)} style={{ fontSize: 13, color: '#d32f2f', fontWeight: 600 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AdminCouponsPage;
