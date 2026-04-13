import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearOrderState } from '../store/orderSlice';
import { clearCart, selectCartTotal } from '../store/cartSlice';
import { formatPrice } from '../utils/helpers';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.orders);
  const cartTotal = useSelector(selectCartTotal);
  const shippingCost = cartTotal >= 150 ? 0 : 10;
  const total = cartTotal + shippingCost;

  const [form, setForm] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    country: '',
    phone: '',
    postalCode: '',
    paymentMethod: 'stripe',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      items: items.map((i) => ({
        product: i.product,
        size: i.size,
        quantity: i.quantity,
      })),
      shippingAddress: {
        fullName: form.fullName,
        address: form.address,
        city: form.city,
        country: form.country,
        phone: form.phone,
        postalCode: form.postalCode,
      },
      paymentMethod: form.paymentMethod,
    };

    const result = await dispatch(createOrder(orderData));

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(clearCart());
      dispatch(clearOrderState());
      navigate('/order-success');
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container" style={{ textAlign: 'center', padding: '120px 0' }}>
          <h1>Your cart is empty</h1>
          <p style={{ color: '#888', marginTop: 16 }}>Add some products before checking out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 style={{ fontSize: 36, marginBottom: 48 }}>CHECKOUT</h1>

        {error && <p style={{ color: '#d32f2f', marginBottom: 16 }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            <div>
              <h3 style={{ fontSize: 20, marginBottom: 24 }}>Shipping Address</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input type="text" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>

              <h3 style={{ fontSize: 20, margin: '32px 0 24px' }}>Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { value: 'stripe', label: 'Credit Card (Stripe)' },
                  { value: 'paypal', label: 'PayPal' },
                  { value: 'cod', label: 'Cash on Delivery' },
                ].map((opt) => (
                  <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', border: form.paymentMethod === opt.value ? '2px solid #000' : '1.5px solid #ddd', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                    <input type="radio" name="payment" value={opt.value} checked={form.paymentMethod === opt.value} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              {items.map((item) => (
                <div key={item.key} className="summary-line">
                  <span>{item.name} ({item.size}) × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="summary-line">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
              </div>
              <div className="summary-line total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button type="submit" className="btn btn-dark" style={{ width: '100%', marginTop: 24 }} disabled={loading}>
                {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
