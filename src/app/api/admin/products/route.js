import { query } from '../../../../lib/db';
import { authenticate } from '../../../../lib/autMiddleware';

export async function POST(req) {
    const authError = authenticate(req);
    if (authError) return authError;

    if (req.user.role !== 'admin') {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 403 });
    }

    const { productName, description, price, size, color, stockQuantity, categoryId, managedBy  } = await req.json();

    // if (!productName || !price || !stockQuantity || !categoryId) {
    //     return new Response(JSON.stringify({ message: 'Product data is required' }), { status: 400 });
    // }

    try {
        const result = await query(
            'INSERT INTO Products (ProductName, Description, Price, Size, Color, StockQuantity, CategoryID, ManagedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [productName, description, price, size, color, stockQuantity, categoryId, managedBy]
        );
        return new Response(JSON.stringify({ message: 'Product added', productId: result.insertId }), { status: 201 });
    } catch (error) {
        console.error('Error adding product:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}




export async function DELETE(req) {
    const authError = authenticate(req);
    if (authError) return authError;

    // Check if user is an admin
    if (req.user.role !== 'admin') {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 403 });
    }

    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!id) {
        return new Response(JSON.stringify({ message: 'Product ID is required' }), { status: 400 });
    }

    try {
        // Check if the product exists
        const [product] = await query('SELECT * FROM Products WHERE ProductID = ?', [id]);
        if (!product) {
            return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
        }

        // Delete the product
        await query('DELETE FROM Products WHERE ProductID = ?', [id]);

        return new Response(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}