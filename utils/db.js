require("dotenv").config();
const mysql = require('mysql');
const pool = dbConnection();

async function executeSQL(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}

function dbConnection() {
    const pool = mysql.createPool({
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      connectionLimit: 10,
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE
    });
    return pool;
  }

module.exports = {
  executeSQL: executeSQL
}