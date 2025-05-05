import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import useScrollToTop from './hooks/useScrollToTop';
import Dashboard from './admin/pages/Dashboard/Dashboard';

// Context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const App = () => {
    useScrollToTop();

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
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:id" element={<ProductDetails />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/admin/dashboard" element={<Dashboard />} />
                        </Routes>
                    </main>
                    <Footer />
                    <ScrollToTop />
                </div>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
