// Sample products data - replace with database calls in a real implementation
const products = [
  {
    product_id: 1,
    name: "Bamboo Dinner Plate",
    description: "Eco-friendly dinner plate made from sustainable bamboo",
    price: 12.99,
    image_url: "/images/products/bamboo-plate.jpg",
    category: "Plates",
    stock_quantity: 100,
    eco_friendly_rating: 5,
    featured: true
  },
  {
    product_id: 2,
    name: "Wooden Cutlery Set",
    description: "Set of 4 wooden utensils - fork, knife, spoon, and napkin",
    price: 8.99,
    image_url: "/images/products/wooden-cutlery.jpg",
    category: "Cutlery",
    stock_quantity: 200,
    eco_friendly_rating: 4,
    featured: false
  },
  {
    product_id: 3,
    name: "Eco-Friendly Cups",
    description: "Biodegradable cups made from plant-based materials",
    price: 6.99,
    image_url: "/images/products/eco-cups.jpg",
    category: "Cups",
    stock_quantity: 150,
    eco_friendly_rating: 5,
    featured: true
  }
];

exports.handler = async (event, context) => {
  // Get path and query parameters
  const path = event.path;
  const productId = path.split('/').pop();
  const method = event.httpMethod;
  
  // Handle different HTTP methods
  if (method === 'GET') {
    // Get a specific product by ID
    if (productId && !isNaN(productId) && productId !== 'products') {
      const product = products.find(p => p.product_id === parseInt(productId));
      
      if (product) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            data: product
          })
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({
            success: false,
            error: 'Product not found'
          })
        };
      }
    }
    
    // Get all products
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: products
      })
    };
  }
  
  // Method not allowed
  return {
    statusCode: 405,
    body: JSON.stringify({
      success: false,
      error: 'Method not allowed'
    })
  };
}; 