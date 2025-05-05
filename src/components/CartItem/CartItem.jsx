import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCart();

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
            updateQuantity(item.id, newQuantity);
        }
    };

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-price">£{item.price.toFixed(2)}</p>
                <div className="cart-item-quantity">
                    <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                    <input
                        type="number"
                        id={`quantity-${item.id}`}
                        min="1"
                        value={item.quantity}
                        onChange={handleQuantityChange}
                    />
                </div>
            </div>
            <div className="cart-item-total">
                <p>£{(item.price * item.quantity).toFixed(2)}</p>
                <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default CartItem; 