// Simple health check endpoint
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'ok', message: 'Green Dining API is running' })
  };
}; 