import { query } from '../../../../../lib/db';

export async function GET(req) {
    const urlParts = req.url.split('/');
    const categoryId = urlParts[urlParts.length - 1];
    
    if (!categoryId) {
        return new Response(JSON.stringify({ message: 'Category ID is required' }), { status: 400 });
    }

    try {
        const products = await query('SELECT * FROM Products WHERE CategoryID = ?', [categoryId]);
        
        if (products.length === 0) {
            return new Response(JSON.stringify({ message: 'No products found for this category' }), { status: 404 });
        }
        
        return new Response(JSON.stringify(products), { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}