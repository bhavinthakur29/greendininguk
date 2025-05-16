import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Products from './pages/Products/Products';
import ProductDetails from './pages/Products/ProductDetails';
import Contact from './pages/Contact/Contact';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';
import NotFound from './pages/NotFound/NotFound';
import BackToTop from './components/BackToTop/BackToTop';
import useScrollToTop from './hooks/useScrollToTop';

// Admin pages
import Dashboard from './admin/pages/Dashboard/Dashboard';
import ProductsManagement from './admin/pages/Products/ProductsManagement';
import Analytics from './admin/pages/Analytics/Analytics';
import OrdersManagement from './admin/pages/Orders/OrdersManagement';
import AdminLogin from './admin/pages/Login/AdminLogin';
import CustomersManagement from './admin/pages/Customers/CustomersManagement';
import SettingsPage from './admin/pages/Settings/SettingsPage';
import HelpPage from './admin/pages/Help/HelpPage';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const App = () => {
    useScrollToTop();
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <AuthProvider>
            <CartProvider>
                <div className="App">
                    <ToastContainer
                        position="bottom-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        style={{ zIndex: 9999 }}
                    />
                    {!isAdminRoute && <Navbar />}
                    <main>
                        <Routes>
                            {/* Client Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:id" element={<ProductDetails />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/order-confirmation" element={<OrderConfirmation />} />

                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin" element={<Dashboard />} />
                            <Route path="/admin/dashboard" element={<Dashboard />} />
                            <Route path="/admin/products" element={<ProductsManagement />} />
                            <Route path="/admin/orders" element={<OrdersManagement />} />
                            <Route path="/admin/customers" element={<CustomersManagement />} />
                            <Route path="/admin/analytics" element={<Analytics />} />
                            <Route path="/admin/settings" element={<SettingsPage />} />
                            <Route path="/admin/help" element={<HelpPage />} />

                            {/* 404 Route - Must be last */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                    {!isAdminRoute && <Footer />}
                    {!isAdminRoute && <BackToTop />}
                </div>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
