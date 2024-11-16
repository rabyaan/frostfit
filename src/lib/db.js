import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,  
  waitForConnections: true,
  connectionLimit: 10, // Max number of connections in the pool
  queueLimit: 0 // Unlimited requests can be queued
});

async function queryDatabase() {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
}

queryDatabase();
