const mysql = require('mysql2/promise');

// Create MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Update with your MySQL username
  password: '1234', // Update with your MySQL password
  database: 'hotel_erp1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('✅ Connected to MySQL database: hotel_erp1');

module.exports = db;