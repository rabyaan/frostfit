import { query } from '../../../../lib/db';

export async function PUT(req) {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1]; // Get CartID from URL
    const { quantity } = await req.json();

    if (!quantity || quantity <= 0) {
        return new Response(JSON.stringify({ message: 'Valid quantity is required' }), { status: 400 });
    }

    try {
        const result = await query(
            'UPDATE Cart SET Quantity = ? WHERE CartID = ?',
            [quantity, id]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: 'Cart item not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'Cart item updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error updating cart item:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}

export async function DELETE(req) {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1]; // Get CartID from URL

    if (!id) {
        return new Response(JSON.stringify({ message: 'Cart item ID is required' }), { status: 400 });
    }

    try {
        const result = await query('DELETE FROM Cart WHERE CartID = ?', [id]);

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: 'Cart item not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'Cart item deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}

export async function clearCart(req) {
    const { customerId } = await req.json();

    if (!customerId) {
        return new Response(JSON.stringify({ message: 'Customer ID is required' }), { status: 400 });
    }

    try {
        const result = await query('DELETE FROM Cart WHERE CustomerID = ?', [customerId]);
        return new Response(JSON.stringify({ message: 'Cart cleared successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}