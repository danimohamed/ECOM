import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/orderSlice';
import { formatPrice } from '../utils/helpers';

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <div className="spinner" />;

  return (
    <div className="collection-page">
      <div className="container">
        <h1>MY ORDERS</h1>

        {orders.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>No orders yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((order) => (
              <div key={order._id} style={{ background: '#f5f5f5', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{formatPrice(order.totalPrice)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    <span className={`status-badge ${order.status}`}>{order.status.toUpperCase()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>
                      {item.name} ({item.size}) × {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
