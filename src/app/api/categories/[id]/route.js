import { query } from '../../../../lib/db';

export async function GET(req) {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!id) {
        return new Response(JSON.stringify({ message: 'Category ID is required' }), { status: 400 });
    }

    try {
        const category = await query('SELECT * FROM Categories WHERE CategoryID = ?', [id]);
        if (category.length === 0) {
            return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(category[0]), { status: 200 });
    } catch (error) {
        console.error('Error fetching category:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}

export async function PUT(req) {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!id) {
        return new Response(JSON.stringify({ message: 'Category ID is required' }), { status: 400 });
    }

    const { categoryName } = await req.json();

    try {
        const result = await query(
            'UPDATE Categories SET CategoryName = ? WHERE CategoryID = ?',
            [categoryName, id]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'Category updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error updating category:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}

export async function DELETE(req) {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];

    if (!id) {
        return new Response(JSON.stringify({ message: 'Category ID is required' }), { status: 400 });
    }

    try {
        // First, find the 'Uncategorized' category ID (if it exists)
        const uncategorizedCategory = await query('SELECT CategoryID FROM Categories WHERE CategoryName = "Uncategorized" LIMIT 1');
        if (uncategorizedCategory.length === 0) {
            return new Response(JSON.stringify({ message: 'Uncategorized category not found' }), { status: 400 });
        }

        // Update all products in the category to the "Uncategorized" category
        await query('UPDATE Products SET CategoryID = ? WHERE CategoryID = ?', [uncategorizedCategory[0].CategoryID, id]);

        // Now delete the original category
        await query('DELETE FROM Categories WHERE CategoryID = ?', [id]);

        return new Response(JSON.stringify({ message: 'Category deleted and products moved to Uncategorized' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting category:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}