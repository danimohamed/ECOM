import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats, fetchAdminOrders, fetchAdminProducts } from '../../store/adminSlice';
import { formatPrice } from '../../utils/helpers';
import { HiOutlineCurrencyDollar, HiOutlineClipboardList, HiOutlineUsers, HiOutlineCube, HiOutlineExclamation } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, orders, products } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAdminOrders());
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  if (!stats) return <div className="spinner" />;

  const statCards = [
    { label: 'Total Sales', value: formatPrice(stats.totalSales), icon: <HiOutlineCurrencyDollar size={20} />, color: '#2a9d3a' },
    { label: 'Orders', value: stats.totalOrders, icon: <HiOutlineClipboardList size={20} />, color: '#004085' },
    { label: 'Users', value: stats.totalUsers, icon: <HiOutlineUsers size={20} />, color: '#6f42c1' },
    { label: 'Products', value: stats.totalProducts, icon: <HiOutlineCube size={20} />, color: '#e6a817' },
  ];

  const maxRevenue = Math.max(...(stats.monthlyRevenue?.map((m) => m.revenue) || [1]));

  const recentOrders = orders.items?.slice(0, 5) || [];
  const lowStockProducts = products.items?.filter((p) => p.totalStock <= 5).sort((a, b) => a.totalStock - b.totalStock).slice(0, 5) || [];
  const pendingOrders = orders.items?.filter((o) => o.status === 'pending').length || 0;
  const paidOrders = orders.items?.filter((o) => o.status === 'paid').length || 0;
  const shippedOrders = orders.items?.filter((o) => o.status === 'shipped').length || 0;
  const deliveredOrders = orders.items?.filter((o) => o.status === 'delivered').length || 0;

  return (
    <div>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <span style={{ color: '#888', fontSize: 13 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="stat-grid">
        {statCards.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="label">{stat.label}</p>
                <p className="value">{stat.value}</p>
              </div>
              <div style={{ background: `${stat.color}15`, color: stat.color, borderRadius: 12, padding: 10, display: 'flex' }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Summary */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <h3>Order Status Overview</h3>
        <div className="order-status-grid">
          <div className="order-status-item">
            <span className="status-badge pending" style={{ fontSize: 13, padding: '6px 16px' }}>PENDING</span>
            <span style={{ fontSize: 24, fontWeight: 800 }}>{pendingOrders}</span>
          </div>
          <div className="order-status-item">
            <span className="status-badge paid" style={{ fontSize: 13, padding: '6px 16px' }}>PAID</span>
            <span style={{ fontSize: 24, fontWeight: 800 }}>{paidOrders}</span>
          </div>
          <div className="order-status-item">
            <span className="status-badge shipped" style={{ fontSize: 13, padding: '6px 16px' }}>SHIPPED</span>
            <span style={{ fontSize: 24, fontWeight: 800 }}>{shippedOrders}</span>
          </div>
          <div className="order-status-item">
            <span className="status-badge delivered" style={{ fontSize: 13, padding: '6px 16px' }}>DELIVERED</span>
            <span style={{ fontSize: 24, fontWeight: 800 }}>{deliveredOrders}</span>
          </div>
        </div>
      </div>

      <div className="admin-two-col">
        <div className="chart-card">
          <h3>Monthly Revenue</h3>
          {stats.monthlyRevenue?.length > 0 ? (
            <div className="chart-bar-container">
              {stats.monthlyRevenue.map((m) => (
                <div
                  key={m._id}
                  className="chart-bar"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                >
                  <span className="chart-value">{formatPrice(m.revenue)}</span>
                  <span className="chart-label">{m._id}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>No revenue data yet</p>
          )}
        </div>

        <div className="chart-card">
          <h3>Orders Trend</h3>
          {stats.monthlyRevenue?.length > 0 ? (
            <div className="chart-bar-container">
              {stats.monthlyRevenue.map((m) => {
                const maxCount = Math.max(...stats.monthlyRevenue.map((x) => x.count));
                return (
                  <div
                    key={m._id}
                    className="chart-bar"
                    style={{ height: `${(m.count / maxCount) * 100}%` }}
                  >
                    <span className="chart-value">{m.count}</span>
                    <span className="chart-label">{m._id}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>No order data yet</p>
          )}
        </div>
      </div>

      <div className="admin-two-col">
        {/* Recent Orders */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Recent Orders</h3>
            <button onClick={() => navigate('/admin/orders')} style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>View All →</button>
          </div>
          {recentOrders.length > 0 ? (
            <div className="recent-list">
              {recentOrders.map((order) => (
                <div key={order._id} className="recent-item">
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{order.user?.name || 'N/A'}</p>
                    <p style={{ color: '#888', fontSize: 12 }}>#{order._id.slice(-8).toUpperCase()} · {order.items?.length} items</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{formatPrice(order.totalPrice)}</p>
                    <span className={`status-badge ${order.status}`} style={{ fontSize: 10 }}>{order.status.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>No orders yet</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <HiOutlineExclamation size={18} style={{ color: '#d32f2f' }} /> Low Stock Alerts
            </h3>
            <button onClick={() => navigate('/admin/products')} style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>View All →</button>
          </div>
          {lowStockProducts.length > 0 ? (
            <div className="recent-list">
              {lowStockProducts.map((p) => (
                <div key={p._id} className="recent-item">
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</p>
                    <p style={{ color: '#888', fontSize: 12 }}>{p.category}</p>
                  </div>
                  <span style={{
                    fontWeight: 700, fontSize: 14,
                    color: p.totalStock === 0 ? '#d32f2f' : '#e6a817'
                  }}>
                    {p.totalStock === 0 ? 'OUT OF STOCK' : `${p.totalStock} left`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#2a9d3a', textAlign: 'center', padding: 40 }}>All products are well stocked!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
