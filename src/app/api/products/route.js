import { query } from '../../../lib/db';

export async function GET() {
    try {
        const products = await query('SELECT * FROM Products');
        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}


export async function POST(req) {
    try {
        const { productName, description, price, size, color, stockQuantity, categoryId, managedBy } = await req.json();

        // Insert the new product into the database
        const result = await query(
            'INSERT INTO Products (ProductName, Description, Price, Size, Color, StockQuantity, CategoryID, ManagedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [productName, description, price, size, color, stockQuantity, categoryId, managedBy]
        );

        return new Response(
            JSON.stringify({ message: 'Product created successfully', productId: result.insertId }),
            { status: 201 }
        );
    } catch (error) {
        console.error('Error during product creation:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}