import jwt from 'jsonwebtoken';

export function authenticate(req) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Bearer token

    if (!token) {
        return new Response(JSON.stringify({ message: 'No token provided' }), { status: 403 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 401 });
    }

    return null; // Proceed to next middleware or handler if authenticated
}
