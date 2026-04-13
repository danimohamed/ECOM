import { useSelector, useDispatch } from 'react-redux';
import { closeCart, removeFromCart, updateQuantity, selectCartTotal } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isOpen } = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={() => dispatch(closeCart())} />
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-head">
          <h3>CART</h3>
          <button className="cart-close" onClick={() => dispatch(closeCart())}>×</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.key} className="cart-line">
                <div className="cart-line-img" style={{ background: item.gradient || '#f3f3f3' }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div className="cart-line-info">
                  <h5>{item.name}</h5>
                  <span>{formatPrice(item.price)} · Size {item.size}</span>
                  <div className="cart-qty">
                    <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}>+</button>
                  </div>
                </div>
                <button className="cart-line-remove" onClick={() => dispatch(removeFromCart(item.key))}>Remove</button>
              </div>
            ))
          )}
        </div>

        <div className="cart-foot">
          <div className="cart-total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button className="btn btn-primary cart-checkout" onClick={handleCheckout} disabled={items.length === 0}>
            CHECKOUT
          </button>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
