import { query } from '../../../../lib/db';

export async function PATCH(req) {
    const urlParts = req.url.split('/');
    const orderId = urlParts[urlParts.length - 1]; // Get OrderID from URL
    const { status } = await req.json();

    if (!status || !['Pending', 'Completed', 'Cancelled'].includes(status)) {
        return new Response(JSON.stringify({ message: 'Invalid status' }), { status: 400 });
    }

    if (!orderId) {
        return new Response(JSON.stringify({ message: 'Order ID is required' }), { status: 400 });
    }

    try {
        await query('UPDATE Orders SET OrderStatus = ? WHERE OrderID = ?', [status, orderId]);
        return new Response(JSON.stringify({ message: 'Order status updated' }), { status: 200 });
    } catch (error) {
        console.error('Error updating order status:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}