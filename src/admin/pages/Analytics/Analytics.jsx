import React, { useState, useEffect } from 'react';
import { FaChartBar, FaChartPie, FaChartLine, FaSync, FaBox } from 'react-icons/fa';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import './Analytics.css';
import { toast } from 'react-toastify';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Default fallback data
const FALLBACK_DATA = {
    revenue: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue (Sample Data)',
                data: [1200, 1900, 1700, 2400, 2100, 2300],
                backgroundColor: 'rgba(74, 137, 220, 0.2)',
                borderColor: 'rgba(74, 137, 220, 1)',
                borderWidth: 1,
            }
        ]
    },
    products: {
        labels: ['Bamboo Plates', 'Eco Cups', 'Wooden Cutlery', 'Leaf Bowls', 'Straw Sets'],
        datasets: [
            {
                label: 'Product Sales (Sample Data)',
                data: [500, 420, 380, 320, 280],
                backgroundColor: [
                    'rgba(74, 137, 220, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(241, 196, 15, 0.8)',
                    'rgba(142, 68, 173, 0.8)',
                ],
                borderWidth: 1,
            }
        ]
    },
    topProducts: [
        { name: 'Bamboo Plates', revenue: 500, quantity_sold: 125, category: 'Plates' },
        { name: 'Eco Cups', revenue: 420, quantity_sold: 105, category: 'Cups' },
        { name: 'Wooden Cutlery', revenue: 380, quantity_sold: 190, category: 'Cutlery' },
        { name: 'Leaf Bowls', revenue: 320, quantity_sold: 80, category: 'Bowls' },
        { name: 'Straw Sets', revenue: 280, quantity_sold: 70, category: 'Accessories' }
    ]
};

const Analytics = () => {
    const [period, setPeriod] = useState('month');
    const [revenueData, setRevenueData] = useState(FALLBACK_DATA.revenue);
    const [productSalesData, setProductSalesData] = useState(FALLBACK_DATA.products);
    const [chartType, setChartType] = useState('bar');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [productSales, setProductSales] = useState(FALLBACK_DATA.topProducts);
    const [totalRevenue, setTotalRevenue] = useState(FALLBACK_DATA.topProducts.reduce((sum, p) => sum + p.revenue, 0));
    const [usingFallbackData, setUsingFallbackData] = useState(false);
    const [serverStatus, setServerStatus] = useState('checking'); // 'online', 'offline', 'checking'

    // Check if server is online
    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                const response = await fetch('/api/health', {
                    signal: AbortSignal.timeout(3000), // 3 second timeout
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    setServerStatus('online');
                } else {
                    setServerStatus('offline');
                }
            } catch (err) {
                console.log('Server health check failed:', err);
                setServerStatus('offline');
            }
        };

        checkServerStatus();
    }, []);

    // Fetch analytics data from API
    const fetchAnalyticsData = async () => {
        try {
            setRefreshing(true);
            setLoading(true);

            // Use relative URL path to avoid CORS issues
            const apiUrl = `/api/analytics?period=${period}`;

            // Add a timeout to the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(apiUrl, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            }).catch(err => {
                throw new Error(`Network error: ${err.message}`);
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                // Process revenue data
                const revData = data.data.revenueByPeriod || {};
                setTotalRevenue(data.data.totalRevenue || 0);

                const labels = Object.keys(revData).map(date => {
                    if (period === 'day') {
                        return new Date(date).toLocaleDateString();
                    } else if (period === 'month') {
                        return date;
                    } else {
                        return date;
                    }
                });

                const values = Object.values(revData);

                setRevenueData({
                    labels,
                    datasets: [
                        {
                            label: 'Revenue',
                            data: values,
                            backgroundColor: 'rgba(74, 137, 220, 0.2)',
                            borderColor: 'rgba(74, 137, 220, 1)',
                            borderWidth: 1,
                        }
                    ]
                });

                // Process product sales data
                if (data.data.topProducts && data.data.topProducts.length > 0) {
                    const productLabels = data.data.topProducts.map(p => p.name);
                    const productValues = data.data.topProducts.map(p => p.revenue);

                    setProductSalesData({
                        labels: productLabels,
                        datasets: [
                            {
                                label: 'Product Sales',
                                data: productValues,
                                backgroundColor: [
                                    'rgba(74, 137, 220, 0.8)',
                                    'rgba(46, 204, 113, 0.8)',
                                    'rgba(231, 76, 60, 0.8)',
                                    'rgba(241, 196, 15, 0.8)',
                                    'rgba(142, 68, 173, 0.8)',
                                    'rgba(52, 152, 219, 0.8)',
                                    'rgba(155, 89, 182, 0.8)',
                                    'rgba(26, 188, 156, 0.8)',
                                    'rgba(244, 167, 66, 0.8)',
                                    'rgba(149, 165, 166, 0.8)',
                                ],
                                borderWidth: 1,
                            }
                        ]
                    });

                    setProductSales(data.data.topProducts);
                }

                setUsingFallbackData(false);
                setError(null);
            } else {
                throw new Error(data.error || 'Failed to fetch analytics data');
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);

            // Log the error but use fallback data instead of showing error message
            setUsingFallbackData(true);

            if (!refreshing) {
                // Only show toast on initial load, not during refresh attempts
                toast.info("Using demo data for analytics visualization", {
                    position: "bottom-right",
                    autoClose: 3000
                });
            }

            // Use fallback data
            setRevenueData(FALLBACK_DATA.revenue);
            setProductSalesData(FALLBACK_DATA.products);
            setProductSales(FALLBACK_DATA.topProducts);
            setTotalRevenue(FALLBACK_DATA.topProducts.reduce((sum, p) => sum + p.revenue, 0));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [period]);

    const handleRefresh = () => {
        fetchAnalyticsData();
    };

    // Change the period of data to view
    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    // Change chart type
    const handleChartTypeChange = (type) => {
        setChartType(type);
    };

    // Format currency in GBP
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP'
        }).format(amount);
    };

    // Calculate percentage of total for each product
    const calculatePercentage = (value) => {
        if (!totalRevenue) return 0;
        return ((value / totalRevenue) * 100).toFixed(1);
    };

    // Chart configuration options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        family: "'Arial', sans-serif",
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: 'Revenue Trend',
                font: {
                    family: "'Arial', sans-serif",
                    size: 16,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y);
                        } else if (context.parsed !== null) {
                            label += formatCurrency(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return formatCurrency(value);
                    }
                }
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += formatCurrency(context.raw);
                        return label;
                    }
                }
            }
        }
    };

    const renderChart = () => {
        if (chartType === 'bar') {
            return <Bar data={revenueData} options={chartOptions} />;
        } else if (chartType === 'line') {
            return <Line data={revenueData} options={chartOptions} />;
        } else {
            return <Pie data={productSalesData} options={pieChartOptions} />;
        }
    };

    return (
        <AdminLayout>
            <div className="analytics">
                <header className="analytics-header">
                    <div>
                        <h1>Analytics & Reports</h1>
                        <p>Track your store performance and sales metrics</p>
                        {usingFallbackData && (
                            <div className="demo-data-notice">
                                <span>Using demo data for visualization</span>
                            </div>
                        )}
                        <div className={`server-status ${serverStatus}`}>
                            <span className="status-indicator"></span>
                            <span className="status-text">
                                {serverStatus === 'online' ? 'Server online' :
                                    serverStatus === 'offline' ? 'Server offline' : 'Checking server status...'}
                            </span>
                        </div>
                    </div>
                    <div className="period-filter">
                        <button
                            className={period === 'week' ? 'active' : ''}
                            onClick={() => handlePeriodChange('week')}
                        >
                            Weekly
                        </button>
                        <button
                            className={period === 'month' ? 'active' : ''}
                            onClick={() => handlePeriodChange('month')}
                        >
                            Monthly
                        </button>
                        <button
                            className={period === 'year' ? 'active' : ''}
                            onClick={() => handlePeriodChange('year')}
                        >
                            Yearly
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading analytics data...</p>
                    </div>
                ) : (
                    <>
                        <div className="charts-grid">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h2 className="chart-title">Revenue Trend</h2>
                                    <div className="chart-actions">
                                        <button
                                            className={`chart-btn ${chartType === 'bar' ? 'active' : ''}`}
                                            onClick={() => handleChartTypeChange('bar')}
                                            title="Bar Chart"
                                        >
                                            <FaChartBar />
                                        </button>
                                        <button
                                            className={`chart-btn ${chartType === 'line' ? 'active' : ''}`}
                                            onClick={() => handleChartTypeChange('line')}
                                            title="Line Chart"
                                        >
                                            <FaChartLine />
                                        </button>
                                        <button
                                            className={`chart-btn ${chartType === 'pie' ? 'active' : ''}`}
                                            onClick={() => handleChartTypeChange('pie')}
                                            title="Pie Chart"
                                        >
                                            <FaChartPie />
                                        </button>
                                    </div>
                                </div>
                                <div className="chart-container">
                                    {renderChart()}
                                </div>
                            </div>

                            <div className="chart-card">
                                <div className="chart-header">
                                    <h2 className="chart-title">Product Sales</h2>
                                </div>
                                <div className="pie-chart-container">
                                    {productSales.length > 0 ? (
                                        <>
                                            <div className="pie-chart-legend">
                                                {productSales.slice(0, 5).map((product, index) => (
                                                    <div className="legend-item" key={index}>
                                                        <div
                                                            className="legend-color"
                                                            style={{ backgroundColor: productSalesData.datasets[0].backgroundColor[index % productSalesData.datasets[0].backgroundColor.length] }}
                                                        ></div>
                                                        <div className="legend-text">
                                                            <span className="legend-label">{product.name}</span>
                                                            <div>
                                                                <span className="legend-value">{formatCurrency(product.revenue)}</span>
                                                                <span className="legend-percentage">({calculatePercentage(product.revenue)}%)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="empty-state">
                                            <p>No product sales data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <div className="chart-header">
                                <h2 className="chart-title">Top Selling Products</h2>
                                <button
                                    className="refresh-btn"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                >
                                    <FaSync className={refreshing ? 'spin' : ''} />
                                    <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                                </button>
                            </div>
                            <div className="table-responsive">
                                {productSales.length === 0 ? (
                                    <div className="empty-state">
                                        <p>No product sales data available</p>
                                    </div>
                                ) : (
                                    <table className="product-sales">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Sold</th>
                                                <th>Revenue</th>
                                                <th>% of Sales</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productSales.map((product, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="product-name">
                                                            <div className="product-details">
                                                                <div className="product-title">{product.name}</div>
                                                                <div className="product-category">{product.category || 'Uncategorized'}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="sales-number">{product.quantity_sold}</td>
                                                    <td className="sales-number">{formatCurrency(product.revenue)}</td>
                                                    <td>
                                                        <div>
                                                            <span>{calculatePercentage(product.revenue)}%</span>
                                                            <div className="progress-bar">
                                                                <div
                                                                    className="progress-fill"
                                                                    style={{
                                                                        width: `${calculatePercentage(product.revenue)}%`,
                                                                        backgroundColor: productSalesData.datasets[0].backgroundColor[index % productSalesData.datasets[0].backgroundColor.length]
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default Analytics; 