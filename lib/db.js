// 201935325-이호성
var mysql = require("mysql");
var db = mysql.createConnection({
  host: "127.0.0.1",
  user: "nodejs",
  password: "nodejsnodejs",
  database: "webdb2023",
});
db.connect();
module.exports = db;
