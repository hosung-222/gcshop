// 201935325-이호성
var db = require("./db");
module.exports = {
  login: (req, res) => {
    var context = {
      menu: "menuForCustomer.ejs",
      who: "손님",
      body: "login.ejs",
      logined: "NO",
    };
    req.app.render("home", context, (err, html) => {
      res.end(html);
    });
  },
  login_process: (req, res) => {
    var post = req.body;
    db.query(
      "select count(*) as num from person where loginid = ? and password = ?",
      [post.id, post.pwd],
      (error, results) => {
        if (results[0].num === 1) {
          db.query(
            "select name, class from person where loginid = ? and password = ?",
            [post.id, post.pwd],
            (error, result) => {
              req.session.is_logined = true;
              req.session.name = result[0].name;
              req.session.class = result[0].class;
              res.redirect("/");
            }
          );
        } else {
          req.session.is_logined = false;
          req.session.name = "손님";
          req.session.class = "99";
          res.end(`<script type='text/javascript'>alert("id or password wrong")
      <!--
      setTimeout("location.href='http://localhost:3000/auth/login'",1000);
      //-->
      </script>`);
        }
      }
    );
  },
  logout_process: (req, res) => {
    req.session.destroy((err) => {
      res.redirect("/");
    });
  },
  signup: (req, res) => {
    var context = {
      menu: "menuForCustomer.ejs",
      who: req.session.name,
      body: "signup.ejs",
      logined: "YES",
    };

    req.app.render("home", context, (err, html) => {
      res.end(html);
    });
  },
  signup_process: (req, res) => {
    var loginid = req.body.loginid;
    var password = req.body.password;
    var name = req.body.name;
    var address = req.body.address;
    var tel = req.body.tel;
    var birth = req.body.birth;
    var cls = "99";
    var point = 0;
    db.query(
      "select * from person where loginid =?",
      [loginid],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(
            "<script>alert('이미 존재하는 id입니다'); window.location.href='/auth/signup';</script>"
          );
        } else {
          var sql =
            "insert into person (loginid, password, name, address,tel,birth,class,point) values (?,?,?,?,?,?,?,?)";
          var params = [
            loginid,
            password,
            name,
            address,
            tel,
            birth,
            cls,
            point,
          ];
          db.query(sql, params, (err, result) => {
            if (err) {
              console.log(err);
              res.send(
                "<script>alert('값을 확인해 주세요.'); window.location.href='/auth/signup';</script>"
              );
              return;
            }
            res.redirect("/auth/login");
          });
        }
      }
    );
  },
};
