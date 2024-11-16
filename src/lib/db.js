import mysql from "mysql2/promise";

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME, // Replace with your database name
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your requirements
  queueLimit: 0, // No limit on queued connection requests
});

// Export the pool for reuse
export function getDBConnection() {
  return pool;
}
