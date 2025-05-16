import React, { useContext, useState } from 'react';
import { FaShoppingCart, FaEye, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const defaultImage = '/default-image.png';

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    // Truncate description to keep consistent card heights
    const truncateDescription = (text, maxLength = 60) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + '...';
    };

    return (
        <div className="product-card">
            <div className="product-image">
                {!imageLoaded && !imageError && (
                    <div className="image-placeholder">
                        Product Image
                    </div>
                )}
                <img
                    src={imageError ? defaultImage : product.image || defaultImage}
                    alt={product.name}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ display: imageLoaded || imageError ? 'block' : 'none' }}
                />
                <div className="product-actions">
                    <button className="action-btn" onClick={handleAddToCart}>
                        <FaShoppingCart />
                        <span>Add to Cart</span>
                    </button>
                    <Link to={`/products/${product.id}`} className="action-btn view-btn">
                        <FaEye />
                        <span>View</span>
                    </Link>
                </div>
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">
                    {truncateDescription(product.shortDescription || product.description)}
                </p>
                <div className="product-meta">
                    <span className="product-price">£{product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                        <span className="product-old-price">£{product.oldPrice.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;