import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Checkout.css';
import { toast } from 'react-toastify';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, totalPrice, removeFromCart, clearCart } = useCart();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: 'United Kingdom',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setLoading(true);

        try {
            // 1. Create or get customer
            const customerResponse = await fetch('http://localhost:3001/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const customerData = await customerResponse.json();

            if (!customerResponse.ok) {
                throw new Error(customerData.error || 'Error creating customer');
            }

            const customer = customerData.data;

            // 2. Create order
            const orderItems = cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                unit_price: item.price,
                subtotal: item.price * item.quantity
            }));

            const orderData = {
                customer_id: customer.customer_id,
                payment_method: 'No Payment Required',
                payment_status: 'paid', // Auto-mark as paid since we're skipping payment
                shipping_method: 'Standard',
                shipping_cost: 0,
                tax_amount: 0,
                subtotal: totalPrice,
                total_amount: totalPrice,
                shipping_address_line1: formData.address_line1,
                shipping_address_line2: formData.address_line2,
                shipping_city: formData.city,
                shipping_postal_code: formData.postal_code,
                shipping_country: formData.country,
                notes: formData.notes,
                items: orderItems
            };

            const orderResponse = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const orderResult = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderResult.error || 'Error creating order');
            }

            // Clear cart completely (not one by one)
            clearCart();

            // Show success and redirect
            toast.success('Order placed successfully!');
            navigate('/order-confirmation', {
                state: {
                    orderId: orderResult.data.order_id,
                    orderTotal: orderResult.data.total_amount
                }
            });

        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Error processing your order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container">
                <h1>Checkout</h1>
                <div className="empty-cart-message">
                    <p>Your cart is empty. Please add some products before proceeding to checkout.</p>
                    <button
                        className="continue-shopping"
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            <div className="checkout-content">
                <div className="checkout-form-container">
                    <h2>Your Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="first_name">First Name*</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name">Last Name*</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email*</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address_line1">Address Line 1*</label>
                            <input
                                type="text"
                                id="address_line1"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address_line2">Address Line 2</label>
                            <input
                                type="text"
                                id="address_line2"
                                name="address_line2"
                                value={formData.address_line2}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City*</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="postal_code">Postal Code*</label>
                                <input
                                    type="text"
                                    id="postal_code"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country*</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Order Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="place-order-btn"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="cart-items-summary">
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-item">
                                <div className="item-info">
                                    <span className="item-quantity">{item.quantity}x</span>
                                    <span className="item-name">{item.name}</span>
                                </div>
                                <span className="item-price">£{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>£{totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>£{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}