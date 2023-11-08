// 201935325-이호성
const express = require("express");
const app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//사용자 정의 모듈
var rootRouter = require("./router/rootRouter");
var authRouter = require("./router/authRouter");
var codeRouter = require("./router/codeRouter");
var personRouter = require("./router/personRouter");
var merchandiseRouter = require("./router/merchandiseRouter");

// 세션 모듈, 세션 DB 저장 모듈
var session = require("express-session");
var MySqlStore = require("express-mysql-session")(session);
var options = {
  host: "127.0.0.1",
  user: "nodejs",
  password: "nodejsnodejs",
  database: "webdb2023",
};

var sessionStore = new MySqlStore(options);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);
// body 파서 모듈
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// 라우터 호출
app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/code", codeRouter);
app.use("/merchandise", merchandiseRouter);
app.use("/person", personRouter);
app.use(express.static("public"));
app.listen(3000, () => console.log("Example app listening on port 3000"));
