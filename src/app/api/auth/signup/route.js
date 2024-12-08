import { query } from '../../../../lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        const { name, email, password, phone, shippingAddress } = await req.json();

        // Check if the user already exists
        const existingUser = await query('SELECT * FROM Customers WHERE Email = ?', [email]);
        if (existingUser.length > 0) {
            return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const result = await query(
            'INSERT INTO Customers (Name, Email, Phone, ShippingAddress, PasswordHash) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, shippingAddress, hashedPassword]
        );

        return new Response(JSON.stringify({ message: 'User registered successfully', userId: result.insertId }), {
            status: 201,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
