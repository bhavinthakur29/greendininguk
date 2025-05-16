import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Import routes
import productsRouter from './routes/products.js';
import customersRouter from './routes/customers.js';
import ordersRouter from './routes/orders.js';
import analyticsRouter from './routes/analytics.js';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Green Dining API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: true, 
    message: err.message || 'An error occurred on the server' 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
}); 