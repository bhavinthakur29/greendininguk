import React, { useContext } from 'react';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    return (
        <div className="product-card">
            <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-actions">
                    <button className="action-btn" onClick={handleAddToCart}>
                        <FaShoppingCart />
                        <span>Add to Cart</span>
                    </button>
                    <Link to={`/products/${product.id}`} className="action-btn view-btn">
                        <FaEye />
                        <span>View Details</span>
                    </Link>
                </div>
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.shortDescription}</p>
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