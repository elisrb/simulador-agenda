const Database = require('better-sqlite3');
const db = new Database('dados.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    name TEXT NOT NULL
  )
`);

module.exports = db;