import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';
import staticProducts from '../../data/products';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [resultsCount, setResultsCount] = useState(0);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/products');

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();

                if (data.success) {
                    // Map API products to the format expected by the frontend
                    const formattedProducts = data.data.map(product => ({
                        id: product.product_id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.image_url || 'https://placehold.co/600x400/2ecc71/ffffff?text=Product+Image',
                        category: product.category ? product.category.toLowerCase() : 'other'
                    }));

                    setProducts(formattedProducts);
                } else {
                    throw new Error(data.error || 'Failed to fetch products');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching products:', err);
                // Fallback to static data
                setProducts(staticProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter and search products
    const filteredProducts = products
        .filter(product => filter === 'all' || product.category === filter)
        .filter(product =>
            searchTerm === '' ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

    // Update results count when filtered products change
    useEffect(() => {
        setResultsCount(filteredProducts.length);
    }, [filteredProducts.length]);

    // Toggle filters visibility on mobile
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Handle search input changes with debounce
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Clear search term
    const clearSearch = () => {
        setSearchTerm('');
    };

    // Loading state with skeleton
    if (loading) {
        return (
            <div className="products-page">
                <section className="products-hero">
                    <h1>Our Products</h1>
                    <p>Eco-friendly dining solutions for every occasion</p>
                </section>
                <div className="products-container">
                    <div className="filter-section">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="skeleton-button"></div>
                        ))}
                    </div>
                    <div className="search-section skeleton"></div>
                    <div className="products-grid">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="product-card-skeleton"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <section className="products-hero">
                <h1>Our Products</h1>
                <p>Eco-friendly dining solutions for every occasion</p>
            </section>

            <div className="products-container">
                <div className="mobile-filter-toggle" onClick={toggleFilters}>
                    <FaFilter />
                    <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                </div>

                {showFilters && (
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
                )}

                <div className="search-section">
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            id="search-input"
                        />
                        {searchTerm && (
                            <button
                                className="clear-search"
                                onClick={clearSearch}
                                aria-label="Clear search"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                </div>

                <div className="results-info">
                    {searchTerm && (
                        <p>
                            {resultsCount === 0
                                ? `No results found for "${searchTerm}"`
                                : `Found ${resultsCount} results for "${searchTerm}"`}
                        </p>
                    )}
                    {!searchTerm && filter !== 'all' && (
                        <p>
                            {resultsCount === 0
                                ? `No products available in "${filter}" category`
                                : `Showing ${resultsCount} ${filter} products`}
                        </p>
                    )}
                </div>

                <div className="products-grid">
                    {filteredProducts.length === 0 ? (
                        <div className="no-products-message">
                            {searchTerm
                                ? `No products found matching "${searchTerm}". Try a different search term.`
                                : "No products available in this category at the moment."}
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