import React from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../../data/products';

const ProductDetails = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === Number(id));

    if (!product) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Product not found</h2>
                <Link to="/products">Back to Products</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.08)' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', maxHeight: 350, objectFit: 'contain', borderRadius: 12, marginBottom: 32 }} />
            <h1 style={{ fontSize: '2.5rem', marginBottom: 16 }}>{product.name}</h1>
            <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: 24 }}>{product.description}</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2ecc71', marginBottom: 32 }}>£{product.price.toFixed(2)}</div>
            <Link to="/products" style={{ color: '#2ecc71', textDecoration: 'underline', fontWeight: 500 }}>← Back to Products</Link>
        </div>
    );
};

export default ProductDetails; 