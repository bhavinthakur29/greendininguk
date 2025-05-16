import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSync, FaTimes } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import './ProductsManagement.css';
import { toast } from 'react-toastify';

const ProductsManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState(['all']);
    const [refreshing, setRefreshing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: 'https://placehold.co/600x400/2ecc71/ffffff?text=Product+Image',
        stock_quantity: 10,
        sku: '',
        is_active: true,
        low_stock_threshold: 5
    });

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            setRefreshing(true);
            const response = await fetch('http://localhost:3001/api/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();

            if (data.success) {
                setProducts(data.data);

                // Extract unique categories
                const uniqueCategories = ['all', ...new Set(data.data.map(product => product.category))];
                setCategories(uniqueCategories);
            } else {
                throw new Error(data.error || 'Failed to load products');
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Load products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on search term and category
    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Format currency in GBP
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP'
        }).format(amount);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleAddProduct = () => {
        // Set category to first available non-all category
        setCurrentProduct({
            name: '',
            description: '',
            price: '',
            category: categories.length > 1 ? categories.find(cat => cat !== 'all') || '' : '',
            image_url: 'https://placehold.co/600x400/2ecc71/ffffff?text=Product+Image',
            stock_quantity: 10,
            sku: '',
            is_active: true,
            low_stock_threshold: 5
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentProduct({
            ...currentProduct,
            [name]: type === 'checkbox' ? checked :
                (type === 'number' ? parseFloat(value) : value)
        });
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const url = isEditing
                ? `http://localhost:3001/api/products/${currentProduct.product_id}`
                : 'http://localhost:3001/api/products';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(currentProduct)
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isEditing ? 'update' : 'add'} product`);
            }

            const result = await response.json();
            if (result.success) {
                toast.success(`Product ${isEditing ? 'updated' : 'added'} successfully`);
                fetchProducts(); // Refresh the products list
                handleCloseModal();
            } else {
                throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'add'} product`);
            }
        } catch (err) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} product:`, err);
            toast.error(err.message);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }

                const result = await response.json();
                if (result.success) {
                    toast.success('Product deleted successfully');
                    fetchProducts(); // Refresh the products list
                } else {
                    throw new Error(result.error || 'Failed to delete product');
                }
            } catch (err) {
                console.error('Error deleting product:', err);
                toast.error(err.message);
            }
        }
    };

    const handleRefresh = () => {
        fetchProducts();
    };

    return (
        <AdminLayout>
            <div className="products-management">
                <header className="products-header">
                    <div>
                        <h1>Products Management</h1>
                        <p>{products.length} products in database</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="refresh-btn"
                            onClick={handleRefresh}
                            disabled={refreshing || loading}
                        >
                            <FaSync className={refreshing ? 'spin' : ''} />
                            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </button>
                        <button className="add-product-btn" onClick={handleAddProduct}>
                            <FaPlus className="icon" />
                            <span>Add New Product</span>
                        </button>
                    </div>
                </header>

                <div className="filters">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="category-filter">
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all'
                                        ? 'All Categories'
                                        : category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                        <button onClick={handleRefresh}>Try Again</button>
                    </div>
                ) : (
                    <div className="products-table-container">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="no-products">
                                            No products found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.product_id}>
                                            <td>
                                                <img
                                                    src={product.image_url || 'https://placehold.co/600x400/2ecc71/ffffff?text=No+Image'}
                                                    alt={product.name}
                                                    className="product-thumbnail"
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/600x400/2ecc71/ffffff?text=Error';
                                                    }}
                                                />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.sku || '-'}</td>
                                            <td>{product.category}</td>
                                            <td>{formatCurrency(product.price)}</td>
                                            <td>
                                                <span className={
                                                    product.stock_quantity <= 0
                                                        ? 'stock-badge out'
                                                        : product.stock_quantity <= (product.low_stock_threshold || 10)
                                                            ? 'stock-badge low'
                                                            : 'stock-badge ok'
                                                }>
                                                    {product.stock_quantity}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-btn"
                                                        title="Edit product"
                                                        onClick={() => handleEditProduct(product)}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="delete-btn"
                                                        title="Delete product"
                                                        onClick={() => handleDeleteProduct(product.product_id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal product-modal">
                            <div className="modal-header">
                                <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                                <button className="close-modal-btn" onClick={handleCloseModal}>
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleSaveProduct}>
                                <div className="modal-tabs">
                                    <div className="tab active">Basic Info</div>
                                    <div className="preview-tab">
                                        <div className="preview-container">
                                            <img
                                                src={currentProduct.image_url || 'https://placehold.co/600x400/2ecc71/ffffff?text=No+Image'}
                                                alt="Product preview"
                                                className="product-preview"
                                                onError={(e) => {
                                                    e.target.src = 'https://placehold.co/600x400/2ecc71/ffffff?text=Error';
                                                }}
                                            />
                                            <div className="preview-details">
                                                <h3>{currentProduct.name || 'Product Name'}</h3>
                                                <p className="preview-price">{formatCurrency(currentProduct.price || 0)}</p>
                                                <p className="preview-category">{currentProduct.category || 'Category'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="name">Product Name*</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={currentProduct.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description*</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={currentProduct.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="price">Price (£)*</label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            step="0.01"
                                            min="0"
                                            value={currentProduct.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category">Category*</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={currentProduct.category}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories
                                                .filter(category => category !== 'all')
                                                .map(category => (
                                                    <option key={category} value={category}>
                                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="sku">SKU</label>
                                        <input
                                            type="text"
                                            id="sku"
                                            name="sku"
                                            value={currentProduct.sku}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="stock_quantity">Stock Quantity*</label>
                                        <input
                                            type="number"
                                            id="stock_quantity"
                                            name="stock_quantity"
                                            min="0"
                                            value={currentProduct.stock_quantity}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="low_stock_threshold">Low Stock Threshold</label>
                                        <input
                                            type="number"
                                            id="low_stock_threshold"
                                            name="low_stock_threshold"
                                            min="1"
                                            value={currentProduct.low_stock_threshold}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image_url">Image URL</label>
                                        <input
                                            type="url"
                                            id="image_url"
                                            name="image_url"
                                            value={currentProduct.image_url}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>

                                <div className="form-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        checked={currentProduct.is_active}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="is_active" className="checkbox-label">
                                        Active (available for purchase)
                                    </label>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" onClick={handleCloseModal} className="cancel-btn">
                                        Cancel
                                    </button>
                                    <button type="submit" className="save-btn">
                                        {isEditing ? 'Update Product' : 'Save Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ProductsManagement; 