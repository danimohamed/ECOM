import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminPayments } from '../../store/adminSlice';
import { formatPrice } from '../../utils/helpers';
import { HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';

const AdminPaymentsPage = () => {
  const dispatch = useDispatch();
  const { payments } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchAdminPayments());
  }, [dispatch]);

  const filtered = payments
    .filter((p) => {
      const matchSearch = !search ||
        p._id.toLowerCase().includes(search.toLowerCase()) ||
        p.user?.name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchMethod = methodFilter === 'all' || p.method === methodFilter;
      return matchSearch && matchStatus && matchMethod;
    });

  const totalRevenue = payments.filter((p) => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <div className="admin-header">
        <h1>Payments <span style={{ fontSize: 14, fontWeight: 400, color: '#888' }}>({filtered.length})</span></h1>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <p className="label">Total Payments</p>
          <p className="value" style={{ fontSize: 24 }}>{payments.length}</p>
        </div>
        <div className="stat-card">
          <p className="label">Completed Revenue</p>
          <p className="value" style={{ fontSize: 24 }}>{formatPrice(totalRevenue)}</p>
        </div>
        <div className="stat-card">
          <p className="label">Pending</p>
          <p className="value" style={{ fontSize: 24 }}>{payments.filter((p) => p.status === 'pending').length}</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <HiOutlineSearch size={16} />
          <input type="text" placeholder="Search by ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="admin-filters">
          <div className="admin-filter-item">
            <HiOutlineFilter size={14} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="admin-filter-item">
            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
              <option value="all">All Methods</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="cod">COD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Customer</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: 40 }}>No payments found</td></tr>
          ) : filtered.map((p) => (
            <tr key={p._id}>
              <td style={{ fontFamily: 'monospace', fontSize: 12 }}>#{p._id.slice(-8).toUpperCase()}</td>
              <td>{p.user?.name || 'N/A'}</td>
              <td style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 600 }}>{p.method}</td>
              <td style={{ fontWeight: 600 }}>{formatPrice(p.amount)}</td>
              <td>
                <span className={`status-badge ${p.status === 'completed' ? 'paid' : p.status === 'failed' ? 'cancelled' : 'pending'}`}>
                  {p.status.toUpperCase()}
                </span>
              </td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
