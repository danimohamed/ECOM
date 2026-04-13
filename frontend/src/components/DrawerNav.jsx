import { Link } from 'react-router-dom';
import { HiOutlineX } from 'react-icons/hi';

const DrawerNav = ({ isOpen, onClose, user, onLogout }) => (
  <>
    <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
    <nav className={`drawer-nav ${isOpen ? 'open' : ''}`}>
      <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, color: '#fff' }}>
        <HiOutlineX size={24} />
      </button>

      <Link to="/" onClick={onClose}>Home</Link>
      <Link to="/upperwear" onClick={onClose}>Upperwear</Link>
      <Link to="/lowerwear" onClick={onClose}>Lowerwear</Link>
      <Link to="/flexgear" onClick={onClose}>Flex Gear</Link>
      <Link to="/all-products" onClick={onClose}>All Products</Link>
      <Link to="/contact" onClick={onClose}>Contact</Link>

      <div className="drawer-bottom">
        {user ? (
          <>
            <Link to="/orders" onClick={onClose}>My Orders</Link>
            {user.role === 'admin' && <Link to="/admin" onClick={onClose}>Admin Panel</Link>}
            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login" onClick={onClose}>Login</Link>
            <Link to="/register" onClick={onClose}>Register</Link>
          </>
        )}
        <div className="drawer-social">
          <a href="#" onClick={onClose}>Instagram</a>
          <a href="#" onClick={onClose}>TikTok</a>
          <a href="#" onClick={onClose}>Pinterest</a>
        </div>
      </div>
    </nav>
  </>
);

export default DrawerNav;
