import { query } from '../../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    try {
        // Fetch user by email
        const [user] = await query('SELECT * FROM Customers WHERE email = ?', [email]);
        console.log('Fetched user:', user);

        if (!user) {
            console.log('User not found');
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
        }

        if (!user.PasswordHash) {
            console.log('Password not found for user');
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
        }

        const passwordMatch = bcrypt.compareSync(password, user.PasswordHash);
        console.log('Password match:', passwordMatch);

        if (!passwordMatch) {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.CustomerID, email: user.Email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return new Response(JSON.stringify({ message: 'Login successful', token }), { status: 200 });
    } catch (error) {
        console.error('Error during login:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}