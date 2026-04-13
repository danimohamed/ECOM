import { Link } from 'react-router-dom';

const OrderSuccessPage = () => (
  <div style={{ textAlign: 'center', padding: '120px 24px' }}>
    <div style={{ fontSize: 64, marginBottom: 24 }}>✓</div>
    <h1 style={{ fontSize: 36, marginBottom: 16 }}>ORDER PLACED</h1>
    <p style={{ color: '#888', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
      Thank you for your order! You will receive a confirmation email shortly. Track your order status in your account.
    </p>
    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
      <Link to="/orders" className="btn btn-dark">VIEW ORDERS</Link>
      <Link to="/" className="btn btn-ghost" style={{ color: '#000', borderColor: '#000' }}>CONTINUE SHOPPING</Link>
    </div>
  </div>
);

export default OrderSuccessPage;
