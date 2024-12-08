const mysql = require('mysql2/promise');
require('dotenv').config(); // Load .env file

console.log('Environment Variables:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function query(sql, params) {
    const [results] = await pool.execute(sql, params);
    return results;
}

module.exports = { pool, query };
