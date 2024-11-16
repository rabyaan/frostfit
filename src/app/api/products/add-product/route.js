import { getDBConnection } from '../../../../lib/db';

export async function POST(req) {
    let body;
    try {
      body = await req.json(); // Try to parse the body as JSON
    } catch (error) {
      return new Response(
        JSON.stringify({ message: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  
    // Destructure fields with the correct names from the request body
    const { name, description, price, size, color, stock, categoryId } = body;
  
    // Validate that none of the required fields are missing
    if (!name || !description || !price || !size || !color || !stock || !categoryId) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  
    // Parse price, stock, and categoryId as numbers
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);
    const parsedCategoryId = parseInt(categoryId, 10);
  
    // Validate numeric fields
    if (isNaN(parsedPrice) || isNaN(parsedStock) || isNaN(parsedCategoryId)) {
      return new Response(
        JSON.stringify({ message: 'Price, Stock Quantity, and Category ID must be valid numbers' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  
    try {
      const pool = getDBConnection();
  
      // Query to insert the new product
      const query = `
        INSERT INTO Products (ProductName, Description, Price, Size, Color, StockQuantity, CategoryID)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.query(query, [name, description, parsedPrice, size, color, parsedStock, parsedCategoryId]);
  
      return new Response(
        JSON.stringify({ message: 'Product added successfully' }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error adding product:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to add product', error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  