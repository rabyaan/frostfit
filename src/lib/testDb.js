
const { query } = require('./db');

async function testConnection() {
    try {
        const rows = await query('SELECT 1 + 1 AS result');
        console.log('Database connected successfully:', rows);
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
}

testConnection();
