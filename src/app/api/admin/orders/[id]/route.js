import { query } from '../../../../../lib/db';
import { authenticate } from '../../../../../lib/autMiddleware';

export async function PATCH(req) {
    try {
        // Authenticate the admin
        const authError = authenticate(req);
        if (authError) return authError;  // If authentication fails, return the error response

        // Get OrderID from the URL
        const urlParts = req.url.split('/');
        const orderId = urlParts[urlParts.length - 1]; // Get OrderID from URL

        // Get the status from the request body
        const { status } = await req.json();

        // Validate the status and orderId
        if (!status || !['Pending', 'Completed', 'Cancelled'].includes(status)) {
            return new Response(JSON.stringify({ message: 'Invalid status' }), { status: 400 });
        }

        if (!orderId) {
            return new Response(JSON.stringify({ message: 'Order ID is required' }), { status: 400 });
        }

        // Update the order status in the database
        await query('UPDATE Orders SET OrderStatus = ? WHERE OrderID = ?', [status, orderId]);

        return new Response(JSON.stringify({ message: 'Order status updated' }), { status: 200 });
    } catch (error) {
        console.error('Error updating order status:', error);
        return new Response(JSON.stringify({ message: error.message || 'Internal server error' }), { status: 500 });
    }
}
