import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Layout
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Customer Pages
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ComingSoonPage from './pages/ComingSoonPage';
import MaintenancePage from './pages/MaintenancePage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import { fetchSiteSettings } from './store/settingsSlice';

const CustomerLayout = ({ children }) => (
  <>
    <AnnouncementBar />
    <Header />
    <CartDrawer />
    <main style={{ minHeight: '60vh' }}>{children}</main>
    <Footer />
  </>
);

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { siteMode, loaded } = useSelector(s => s.settings);
  const user = useSelector(s => s.auth.user);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchSiteSettings());
  }, [dispatch]);

  // Show nothing while settings load
  if (!loaded) return null;

  // Site is not live and user is not admin
  const siteDown = !isAdmin && siteMode !== 'live';

  // If site is down, only allow /login (without store layout) and /admin
  if (siteDown && !location.pathname.startsWith('/admin')) {
    return (
      <>
        <Toaster position="top-center" toastOptions={{ style: { background: '#000', color: '#fff', borderRadius: 50, fontSize: 14 } }} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={siteMode === 'coming-soon' ? <ComingSoonPage /> : <MaintenancePage />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: '#000', color: '#fff', borderRadius: 50, fontSize: 14 } }} />
      <WhatsAppButton />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path="/upperwear" element={<CustomerLayout><CollectionPage category="upperwear" /></CustomerLayout>} />
        <Route path="/lowerwear" element={<CustomerLayout><CollectionPage category="lowerwear" /></CustomerLayout>} />
        <Route path="/flexgear" element={<CustomerLayout><CollectionPage category="flexgear" /></CustomerLayout>} />
        <Route path="/all-products" element={<CustomerLayout><CollectionPage /></CustomerLayout>} />
        <Route path="/product/:id" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
        <Route path="/contact" element={<CustomerLayout><ContactPage /></CustomerLayout>} />
        <Route path="/login" element={<CustomerLayout><LoginPage /></CustomerLayout>} />
        <Route path="/register" element={<CustomerLayout><RegisterPage /></CustomerLayout>} />
        <Route path="/checkout" element={<ProtectedRoute><CustomerLayout><CheckoutPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><CustomerLayout><OrderSuccessPage /></CustomerLayout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><CustomerLayout><MyOrdersPage /></CustomerLayout></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
