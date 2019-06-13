const dbFile = './.data/sqlite.db';
var fs = require('fs');
const exists = fs.existsSync(dbFile);
const sqlite3 = require('sqlite3').verbose();