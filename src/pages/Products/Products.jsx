import React, { useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';
import products from '../../data/products';

const Products = () => {
    const [filter, setFilter] = useState('all');

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(product => product.category === filter);

    return (
        <div className="products-page">
            <section className="products-hero">
                <h1>Our Products</h1>
                <p>Eco-friendly dining solutions for every occasion</p>
            </section>

            <div className="products-container">
                <div className="filter-section">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Products
                    </button>
                    <button
                        className={`filter-btn ${filter === 'plates' ? 'active' : ''}`}
                        onClick={() => setFilter('plates')}
                    >
                        Plates
                    </button>
                    <button
                        className={`filter-btn ${filter === 'bowls' ? 'active' : ''}`}
                        onClick={() => setFilter('bowls')}
                    >
                        Bowls
                    </button>
                    <button
                        className={`filter-btn ${filter === 'cutlery' ? 'active' : ''}`}
                        onClick={() => setFilter('cutlery')}
                    >
                        Cutlery
                    </button>
                    <button
                        className={`filter-btn ${filter === 'cups' ? 'active' : ''}`}
                        onClick={() => setFilter('cups')}
                    >
                        Cups
                    </button>
                    <button
                        className={`filter-btn ${filter === 'accessories' ? 'active' : ''}`}
                        onClick={() => setFilter('accessories')}
                    >
                        Accessories
                    </button>
                </div>

                <div className="products-grid">
                    {filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', width: '1200px', padding: '2rem', color: '#888', fontSize: '1.2rem' }}>
                            No products available in this category for now.
                        </div>
                    ) : (
                        filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}


                </div>
            </div>
        </div>
    );
};

export default Products; 