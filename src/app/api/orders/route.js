import { query } from '../../../lib/db';

export async function POST(req) {
    const { customerId, cartItems } = await req.json(); // cartItems should include ProductID and Quantity

    if (!customerId || !cartItems || cartItems.length === 0) {
        return new Response(JSON.stringify({ message: 'Customer ID and cart items are required' }), { status: 400 });
    }

    try {
        // Calculate the total amount for the order
        let totalAmount = 0;
        for (const item of cartItems) {
            const product = await query('SELECT * FROM Products WHERE ProductID = ?', [item.productId]);
            if (product.length === 0) {
                return new Response(JSON.stringify({ message: `Product with ID ${item.productId} not found` }), { status: 404 });
            }
            totalAmount += product[0].Price * item.quantity;
        }

        // Insert the order
        const result = await query('INSERT INTO Orders (CustomerID, OrderDate, TotalAmount, OrderStatus) VALUES (?, NOW(), ?, ?)', 
            [customerId, totalAmount, 'Pending']);
        
        // Insert order items
        for (const item of cartItems) {
            await query('INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price) VALUES (?, ?, ?, ?)', 
                [result.insertId, item.productId, item.quantity, item.price]);
        }

        // Update stock quantity
        for (const item of cartItems) {
            await query('UPDATE Products SET StockQuantity = StockQuantity - ? WHERE ProductID = ?', [item.quantity, item.productId]);
        }

        // Clear the cart for the customer
        await query('DELETE FROM Cart WHERE CustomerID = ?', [customerId]);

        return new Response(JSON.stringify({ message: 'Order placed successfully', orderId: result.insertId }), { status: 201 });
    } catch (error) {
        console.error('Error placing order:', error);
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
        const orders = await query(
            'SELECT Orders.OrderID, Orders.OrderDate, Orders.TotalAmount, Orders.OrderStatus ' +
            'FROM Orders WHERE Orders.CustomerID = ?',
            [customerId]
        );
        
        return new Response(JSON.stringify(orders), { status: 200 });
    } catch (error) {
        console.error('Error fetching order history:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}