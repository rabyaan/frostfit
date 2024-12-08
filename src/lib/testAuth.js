
const jwt = require('jsonwebtoken');

export function authenticate(req) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token payload to req.user
    } catch (error) {
        console.error('Token verification failed:', error);
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 403 });
    }
}
