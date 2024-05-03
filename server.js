// This file is responsible for setting up the server

const express = require('express');
const app = express();

// Middleware setup
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Employee info tracker');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'mysql',
  user: 'root@localhost',
  password: 'Crash622!',
  database: 'mysql',
  insecureAuth: true // Add this option
});


// Example query
pool.query('SELECT * FROM your_table', (error, results, fields) => {
  if (error) {
    console.error('Error executing query:', error);
    return;
  }
  console.log('Query results:', results);
});

// Close the connection pool when your application is shutting down
process.on('SIGINT', () => {
  pool.end((err) => {
    if (err) {
      console.error('Error closing the connection pool:', err);
      process.exit(1);
    }
    console.log('Connection pool closed');
    process.exit(0);
  });
});
