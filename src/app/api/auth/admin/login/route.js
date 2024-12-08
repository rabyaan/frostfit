import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../../../../../lib/db';

export async function POST(req) {
    const { email, password } = await req.json();

    // Validate email and password
    if (!email || !password) {
        return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    try {
        // Fetch admin details
        const result = await query('SELECT * FROM Admin WHERE Email = ?', [email]);

        if (result.length === 0) {
            return new Response(JSON.stringify({ message: 'Admin not found' }), { status: 404 });
        }

        const admin = result[0];

        // Verify password
        const match = await bcrypt.compare(password, admin.PasswordHash);
        if (!match) {
            return new Response(JSON.stringify({ message: 'Invalid password' }), { status: 401 });
        }

        // Generate token
        const token = jwt.sign(
            { adminId: admin.AdminID, email: admin.Email, role: 'admin' },
            process.env.JWT_SECRET, // Use secret from .env
            { expiresIn: '1h' }
        );

        // Respond with token
        return new Response(JSON.stringify({ message: 'Login successful', token }), { status: 200 });
    } catch (error) {
        console.error('Error logging in:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
