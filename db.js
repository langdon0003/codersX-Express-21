const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
db.defaults({
  booksList: [],
  usersList: [],
  transactionsList: []
}).write();

module.exports = db;
