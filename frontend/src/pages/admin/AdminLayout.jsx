import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineClipboardList, HiOutlineUsers, HiOutlineCreditCard, HiOutlineTag, HiOutlineCog, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const links = [
    { to: '/admin', icon: <HiOutlineChartBar size={18} />, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: <HiOutlineCube size={18} />, label: 'Products' },
    { to: '/admin/orders', icon: <HiOutlineClipboardList size={18} />, label: 'Orders' },
    { to: '/admin/users', icon: <HiOutlineUsers size={18} />, label: 'Users' },
    { to: '/admin/payments', icon: <HiOutlineCreditCard size={18} />, label: 'Payments' },
    { to: '/admin/coupons', icon: <HiOutlineTag size={18} />, label: 'Coupons' },
    { to: '/admin/settings', icon: <HiOutlineCog size={18} />, label: 'Settings' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile top bar */}
      <div className="admin-mobile-topbar">
        <button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <HiOutlineMenu size={22} />
        </button>
        <span className="admin-topbar-title">OPPA Admin</span>
      </div>

      {/* Sidebar overlay for mobile */}
      <div className={`admin-sidebar-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-head">
          <div className="admin-logo">
          <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" style={{ height: 32 }}>
            <path fill="currentColor" d="M206.451,67.015c-.477-.156-2.323-.233-7.779,4.178-4.489,3.644-1.907,7.139.132,8.972.509.449,1.65,1.889,2.514,3.753.367.788.56,1.622.595,2.425.075,1.741-.537,3.454-1.757,4.722-.073.121-.187.204-.282.287-.756.66-1.79,1.214-1.79,1.214l-5.572,3.514c-.609.418-1.115.969-1.438,1.65-2.961,5.891-19.091,36.384-23.821,60.346-.614,3.045-1.016,5.983-1.21,8.756-.015.099-.032.178-.008.275-.017.51-.035,1.001-.053,1.492-.015,1.471.026,2.881.083,4.191l.011.254c.197,2.285.64,4.383,1.347,6.234.023.077.065.134.107.211v.02c.378.572,1.223,1.065,2.161,1.455,1.059.464,2.211.806,2.903.953,1.248.299,2.283,1.117,2.859,2.209.319.574.505,1.252.535,1.957l1.57,49.547c.014.313.047.645.138.935.003.078.026.156.069.232l.771,1.515,4.636,8.857,3.353,6.383c.063.095.106.191.169.287,3.905,6.457,9.92,15.019,14.398,21.118-1.014,2.396-.871,2.076-1.885,4.472-5.982.846-13.901,2.207-15.251,3.638-1.947,2.123-2.783,9.098-2.95,10.674-1.896,3.316,13.932,6.672,21.776,2.216.613-.321,6.263-2.505,6.951-2.456,3.523.318,10.553.152,13.368-4.576,3.034-5.091-10.747-95.061-13.214-111.794-.227-1.617.431-3.194,1.721-4.171l9.304-6.988c.95-.707,1.55-1.772,1.716-2.936,1.284-9.308,5.545-51.854-6.247-65.734-.786-.946-.941-2.273-.3-3.319.33-.524.753-1.17,1.361-1.157,10.436.157,20.208-13.242,10.991-24.233-8.616-10.233-16.857-4.957-19.559-2.626-.037.041-.076.062-.114.083v.02c.149.248,3.339,5.58,1.619,6.144-1.664.503-3.628-4.568-3.848-5.127"/>
            <path fill="currentColor" d="M93.476,68.234c-.189.57-1.865,5.743-3.555,5.334-1.749-.467,1.138-5.969,1.272-6.225v-.02c-.04-.019-.079-.038-.119-.077-2.829-2.177-11.352-6.984-19.382,3.715-8.588,11.49,1.918,24.321,12.328,23.581.607-.047,1.065.574,1.424,1.079.699,1.009.618,2.342-.114,3.331-10.998,14.517-4.365,56.758-2.563,65.98.23,1.153.89,2.182,1.877,2.835l9.68,6.457c1.343.903,2.088,2.441,1.952,4.068-1.527,16.844-10.258,107.445-6.943,112.358,3.075,4.563,10.103,4.336,13.603,3.821.684-.087,6.447,1.778,7.078,2.064,8.082,4.01,23.697-.225,21.619-3.43-.255-1.564-1.48-8.481-3.543-10.492-1.427-1.353-9.411-2.269-15.43-2.779-1.146-2.336-.986-2.024-2.132-4.36,4.13-6.34,9.657-15.225,13.195-21.89.058-.099.095-.197.153-.296l2.991-6.561,4.134-9.102.685-1.556c.038-.079.057-.157.056-.236.075-.295.09-.628.086-.941l-1.203-49.558c-.009-.705.139-1.392.425-1.984.514-1.123,1.502-1.997,2.731-2.366.683-.185,1.814-.591,2.845-1.114.915-.443,1.731-.982,2.076-1.574v-.02c.038-.079.076-.138.095-.217.603-1.888.928-4.008.996-6.3l-.003-.255c-.017-1.312-.054-2.722-.152-4.19-.045-.489-.091-.978-.137-1.487.018-.098-.002-.176-.023-.274-.349-2.757-.915-5.668-1.698-8.675-6.062-23.661-23.872-53.204-27.157-58.92-.361-.661-.897-1.183-1.528-1.567l-5.76-3.197s-1.064-.496-1.855-1.112c-.099-.077-.217-.154-.297-.27-1.288-1.198-1.995-2.873-2.018-4.616-.01-.803.136-1.647.458-2.454.759-1.91,1.817-3.412,2.301-3.888,1.934-1.944,4.316-5.579-.37-8.966-5.693-4.099-7.532-3.919-8-3.736"/>
            <polygon fill="currentColor" points="146.986 2.321 152.164 16.191 166.955 15.553 155.364 24.763 160.542 38.633 148.2 30.455 136.609 39.666 140.573 25.401 128.231 17.224 143.022 16.585 146.986 2.321"/>
          </svg>
        </div>
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <HiOutlineX size={20} />
          </button>
        </div>
        <nav className="admin-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px 24px' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#888', fontSize: 13 }}>
            <HiOutlineLogout size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
