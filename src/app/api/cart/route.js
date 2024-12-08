import { query } from '../../../lib/db';

export async function POST(req) {
    const { customerId, productId, quantity } = await req.json();

    if (!customerId || !productId || !quantity) {
        return new Response(JSON.stringify({ message: 'Customer ID, Product ID, and Quantity are required' }), { status: 400 });
    }

    try {
        // Check if the product exists
        const product = await query('SELECT * FROM Products WHERE ProductID = ?', [productId]);
        if (product.length === 0) {
            return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
        }

        // Check if the product is already in the cart
        const existingCartItem = await query(
            'SELECT * FROM Cart WHERE CustomerID = ? AND ProductID = ?',
            [customerId, productId]
        );

        if (existingCartItem.length > 0) {
            // If the product exists in the cart, update the quantity
            await query(
                'UPDATE Cart SET Quantity = Quantity + ? WHERE CustomerID = ? AND ProductID = ?',
                [quantity, customerId, productId]
            );
            return new Response(JSON.stringify({ message: 'Cart item updated successfully' }), { status: 200 });
        }

        // If the product doesn't exist in the cart, insert a new item
        const result = await query(
            'INSERT INTO Cart (CustomerID, ProductID, Quantity) VALUES (?, ?, ?)',
            [customerId, productId, quantity]
        );

        return new Response(JSON.stringify({ message: 'Item added to cart', cartItemId: result.insertId }), { status: 201 });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}


export async function GET(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const customerId = url.searchParams.get('customerId');

    if (!customerId) {
        return new Response(JSON.stringify({ message: 'Customer ID is required' }), { status: 400 });
    }

    try {
        const cartItems = await query(
            'SELECT Cart.CartID, Products.ProductName, Cart.Quantity, Products.Price ' +
            'FROM Cart ' +
            'JOIN Products ON Cart.ProductID = Products.ProductID ' +
            'WHERE Cart.CustomerID = ?',
            [customerId]
        );

        return new Response(JSON.stringify(cartItems), { status: 200 });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}