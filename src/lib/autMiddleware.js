import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function authenticate(req) {
    const authHeader = req.headers.get('Authorization'); // Ensure proper header fetching
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
        return new Response(JSON.stringify({ message: 'Authorization header is required' }), { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    console.log('Token extracted:', token);

    if (!token) {
        return new Response(JSON.stringify({ message: 'Token is required' }), { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        console.log('Decoded Token:', decoded);
        req.user = decoded; // Attach user details to the request
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }
}
