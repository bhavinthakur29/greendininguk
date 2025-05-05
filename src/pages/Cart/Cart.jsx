import React from 'react';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/CartItem/CartItem';
import './Cart.css';

const Cart = () => {
    const { cartItems, totalPrice, removeFromCart, updateQuantity } = useCart();

    const handleCheckout = () => {
        console.log('Proceeding to checkout');
    };

    // Optionally, use removeFromCart and updateQuantity directly in Cart.jsx
    const handleItemRemove = (id) => {
        removeFromCart(id); // Use removeFromCart function
    };

    const handleQuantityChange = (id, quantity) => {
        updateQuantity(id, quantity); // Use updateQuantity function
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-empty">
                    <h1>Your Cart is Empty</h1>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="/products" className="continue-shopping-btn">
                        Continue Shopping
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Your Shopping Cart</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onRemove={() => handleItemRemove(item.id)} // Call remove function
                            onQuantityChange={handleQuantityChange}  // Pass update function to CartItem
                        />
                    ))}
                </div>
                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-item">
                        <span>Subtotal</span>
                        <span>£{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-item total">
                        <span>Total</span>
                        <span>£{totalPrice.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
