// API configuration based on environment
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

// Base URL for API calls
export const API_BASE_URL = isDevelopment
  ? 'http://localhost:3001/api' // Development - local server
  : '/api';                      // Production - Netlify Functions

// Other configuration settings
export const CONFIG = {
  siteName: 'Green Dining',
  currency: 'GBP',
  currencySymbol: '£'
}; 