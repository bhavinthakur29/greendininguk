import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If no order details in location state, try to fetch from API
        if (location.state?.orderId) {
            const fetchOrder = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/api/orders/${location.state.orderId}`);
                    const data = await response.json();

                    if (data.success) {
                        setOrderDetails(data.data);
                    } else {
                        throw new Error('Order not found');
                    }
                } catch (error) {
                    console.error('Error fetching order:', error);
                    // If we can't fetch order details, at least show basic info
                    setOrderDetails({
                        order_id: location.state.orderId,
                        total_amount: location.state.orderTotal || 0
                    });
                } finally {
                    setLoading(false);
                }
            };

            fetchOrder();
        } else {
            // No order details, redirect to home
            navigate('/');
        }
    }, [location, navigate]);

    if (loading) {
        return (
            <div className="order-confirmation-container">
                <div className="loader">Loading order details...</div>
            </div>
        );
    }

    return (
        <div className="order-confirmation-container">
            <div className="confirmation-box">
                <div className="confirmation-header">
                    <div className="success-icon">✓</div>
                    <h1>Order Confirmed!</h1>
                    <p>Thank you for your purchase. Your order has been received.</p>
                </div>

                <div className="order-info">
                    <div className="info-row">
                        <span className="info-label">Order Number:</span>
                        <span className="info-value">#{orderDetails.order_id}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Date:</span>
                        <span className="info-value">
                            {orderDetails.order_date
                                ? new Date(orderDetails.order_date).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })
                                : new Date().toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })
                            }
                        </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Total:</span>
                        <span className="info-value">£{Number(orderDetails.total_amount).toFixed(2)}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Status:</span>
                        <span className="info-value status-badge">
                            {orderDetails.status || 'Processing'}
                        </span>
                    </div>
                </div>

                {orderDetails.items && orderDetails.items.length > 0 && (
                    <div className="order-items">
                        <h2>Order Items</h2>
                        <div className="items-list">
                            {orderDetails.items.map(item => (
                                <div key={item.order_item_id} className="order-item">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-details">
                                        <span>{item.quantity} × £{Number(item.unit_price).toFixed(2)}</span>
                                        <span>£{Number(item.subtotal).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="next-steps">
                    <p>We've sent a confirmation email to your inbox.</p>
                    <div className="action-buttons">
                        <button onClick={() => navigate('/')}>
                            Return to Home
                        </button>
                        <button onClick={() => navigate('/products')}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 