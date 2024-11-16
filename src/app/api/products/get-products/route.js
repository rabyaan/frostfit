import { getDBConnection } from '../../../../lib/db';

export async function GET() {
  try {
    // Get the connection pool
    const pool = getDBConnection();

    // Query to fetch all products
    const query = `
      SELECT 
        Products.ProductID,
        Products.ProductName,
        Products.Description,
        Products.Price,
        Products.Size,
        Products.Color,
        Products.StockQuantity,
        Categories.CategoryName
      FROM Products
      JOIN Categories ON Products.CategoryID = Categories.CategoryID
    `;

    const [rows] = await pool.query(query);

    // Return the products as JSON
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response('Failed to fetch products', { status: 500 });
  }
}