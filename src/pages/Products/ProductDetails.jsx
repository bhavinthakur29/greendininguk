import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3001/api/products/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }

                const data = await response.json();

                if (data.success) {
                    setProduct(data.data);
                } else {
                    throw new Error(data.error || 'Failed to fetch product');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: product.product_id,
                name: product.name,
                price: product.price,
                image: product.image_url || '/images/product-placeholder.jpg',
                description: product.description
            });
        }
    };

    if (loading) {
        return (
            <div className="product-details-container loading">
                <div className="loading-spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-details-container error">
                <h2>Product not found</h2>
                <p>{error || 'The requested product could not be found.'}</p>
                <button onClick={() => navigate('/products')}>
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="product-details-container">
            <div className="product-details-content">
                <div className="product-image-container">
                    <img
                        src={product.image_url || '/images/product-placeholder.jpg'}
                        alt={product.name}
                        className="product-image"
                    />
                </div>

                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>

                    <div className="product-meta">
                        <span className="product-category">{product.category}</span>
                        {product.eco_friendly_rating && (
                            <div className="eco-rating">
                                <span>Eco Rating:</span>
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={i < product.eco_friendly_rating ? 'star filled' : 'star'}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="product-description">{product.description}</p>

                    {product.material && (
                        <div className="product-attribute">
                            <span>Material:</span> {product.material}
                        </div>
                    )}

                    {product.color && (
                        <div className="product-attribute">
                            <span>Color:</span> {product.color}
                        </div>
                    )}

                    {product.dimensions && (
                        <div className="product-attribute">
                            <span>Dimensions:</span> {product.dimensions}
                        </div>
                    )}

                    <div className="product-price">£{Number(product.price).toFixed(2)}</div>

                    <div className="product-actions">
                        <button
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity <= 0}
                        >
                            {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>

                        <Link to="/products" className="back-link">
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails; 