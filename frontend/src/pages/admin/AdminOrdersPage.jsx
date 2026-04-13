import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrders, updateOrderStatus } from '../../store/adminSlice';
import { formatPrice } from '../../utils/helpers';
import { HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi';

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  const filtered = (orders.items || [])
    .filter((o) => {
      const matchSearch = !search ||
        o._id.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'highest') return b.totalPrice - a.totalPrice;
      if (sortBy === 'lowest') return a.totalPrice - b.totalPrice;
      return 0;
    });

  return (
    <div>
      <div className="admin-header">
        <h1>Orders <span style={{ fontSize: 14, fontWeight: 400, color: '#888' }}>({filtered.length})</span></h1>
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
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="admin-filter-item">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Total</option>
              <option value="lowest">Lowest Total</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 40 }}>No orders found</td></tr>
          ) : filtered.map((order) => (
            <tr key={order._id}>
              <td style={{ fontFamily: 'monospace', fontSize: 12 }}>#{order._id.slice(-8).toUpperCase()}</td>
              <td>{order.user?.name || 'N/A'}</td>
              <td>{order.items?.length} items</td>
              <td style={{ fontWeight: 600 }}>{formatPrice(order.totalPrice)}</td>
              <td><span className={`status-badge ${order.status}`}>{order.status.toUpperCase()}</span></td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 12 }}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
