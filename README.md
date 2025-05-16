# Green Dining - Eco-Friendly Dining E-Commerce

A modern e-commerce platform for eco-friendly dining products built with React and Express.js.

## Features

- Responsive front-end built with React
- Complete admin dashboard with product, order, and customer management
- Data visualization with Chart.js
- SQLite database with better-sqlite3
- RESTful API endpoints for all data operations
- Search and filter functionality
- Cart management system

## Installation

### Prerequisites

- Node.js (v14+)
- Bun

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/greendining.git
   cd greendining
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Run the application (two options):
   
   **Option 1**: Use the provided batch file:
   ```
   start-app.bat
   ```
   This will open both the server and frontend in separate windows.

   **Option 2**: Run the development server directly:
   ```
   bun run dev:full
   ```

4. Open your browser and navigate to:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## Project Structure

- `/src` - React frontend
- `/server` - Express.js backend
  - `/server/db` - SQLite database and connection
  - `/server/routes` - API routes
- `/public` - Static assets

## API Endpoints

- `/api/products` - Product management
- `/api/customers` - Customer management
- `/api/orders` - Order management
- `/api/analytics` - Analytics and reporting

## Scripts

- `bun run dev` - Start the frontend development server
- `bun run server` - Start the backend server
- `bun run dev:full` - Start both frontend and backend concurrently
- `start-app.bat` - Windows batch file to start both services

## Utility Scripts

This repository includes utility batch files to help with development and setup:

- `start-app.bat` - Start the application with server and frontend
- `cleanup-npm.bat` - Remove npm-related files and ensure Bun-only setup
- `init-repo.bat` - Initialize a new Git repository, clean up npm files, and prepare for first push

## Security Notes

- The database file is included for demonstration purposes only
- In a production environment:
  - Use environment variables for configuration (.env files)
  - Implement proper authentication and authorization
  - Consider using a more robust database solution

## License

[MIT License](LICENSE)

## Contact

For any questions or support, please open an issue on GitHub.

## Deployment

### Netlify Deployment

This project is configured for deployment on Netlify:

1. **Connect to GitHub**: 
   - Sign up for Netlify and connect your GitHub account
   - Select the repository containing this project

2. **Configure the Build Settings**:
   - Build command: `bun run build`
   - Publish directory: `dist`
   - The `netlify.toml` file already contains the necessary configuration

3. **Environment Variables**:
   Add these in the Netlify dashboard under Site settings → Environment variables:
   - No environment variables are required for basic functionality

4. **Deploy**:
   - Click 'Deploy site' in the Netlify dashboard
   - Netlify will build and deploy your site automatically

5. **Using Netlify Functions**:
   The project is set up with Netlify Functions to handle backend APIs. When deployed,
   API calls will automatically be routed to the serverless functions in the `netlify/functions` directory. 