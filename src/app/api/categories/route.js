import { query } from '../../../lib/db';

export async function POST(req) {
    try {
        const { categoryName } = await req.json();

        // Check if the category already exists
        const existingCategory = await query('SELECT * FROM Categories WHERE CategoryName = ?', [categoryName]);
        if (existingCategory.length > 0) {
            return new Response(JSON.stringify({ message: 'Category already exists' }), { status: 400 });
        }

        // Insert the new category
        const result = await query('INSERT INTO Categories (CategoryName) VALUES (?)', [categoryName]);
        return new Response(JSON.stringify({ message: 'Category created successfully', categoryId: result.insertId }), { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}

export async function GET() {
    try {
        const categories = await query('SELECT * FROM Categories');
        return new Response(JSON.stringify(categories), { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}