import { query } from '../../../../lib/db';
import { authenticate } from '../../../../lib/autMiddleware';

export async function GET(req) {
    const authError = authenticate(req); // Authenticate request
    if (authError) return authError; // Return error if authentication fails

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 403 });
    }

    try {
        // Fetch all orders
        const orders = await query('SELECT * FROM Orders');
        return new Response(JSON.stringify(orders), { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
