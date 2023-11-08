// 201935325-이호성
const db = require("./db"); // db 연결 모듈을 불러옵니다.
function authIsOwner(req, res) {
  if (req.session.is_logined) {
    return true;
  } else {
    return false;
  }
}
function authIsAdmin(req, res) {
  if (req.session.is_logined && req.session.class == "01") {
    return true;
  } else {
    return false;
  }
}
module.exports = {
  view: (req, res) => {
    const viewUpdate = req.params.vu;
    var isOwner = authIsOwner(req, res);
    var isAdmin = authIsAdmin(req, res);
    db.query("SELECT * FROM person", (err, persons) => {
      var context = {
        menu: isAdmin ? "menuForManager.ejs" : "menuForCustomer.ejs",
        who: req.session.name,
        body: "person.ejs",
        logined: isOwner ? "YES" : "NO",
        persons: persons,
        vu: viewUpdate,
      };

      req.app.render("home", context, (err, html) => {
        res.end(html);
      });
    });
  },
  create: (req, res) => {
    var isAdmin = authIsAdmin(req, res);

    if (isAdmin) {
      var context = {
        menu: "menuForManager.ejs",
        who: req.session.name,
        body: "personCU.ejs",
        logined: "YES",
        action: "/person/create_process",
      };

      req.app.render("home", context, (err, html) => {
        res.end(html);
      });
    } else {
      res.status(403).send("권한이 없습니다.");
    }
  },
  create_process: (req, res) => {
    var loginid = req.body.loginid;
    var password = req.body.password;
    var name = req.body.name;
    var address = req.body.address;
    var tel = req.body.tel;
    var birth = req.body.birth;
    var cla = req.body.class;
    var point = req.body.point;
    db.query(
      "select * from person where loginid =?",
      [loginid],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          res.send(
            "<script>alert('이미 존재하는 id입니다'); window.location.href='/person/create';</script>"
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
            cla,
            point,
          ];
          db.query(sql, params, (err, result) => {
            if (err) {
              console.log(err);
              res.send(
                "<script>alert('값을 확인해 주세요.'); window.location.href='/person/create';</script>"
              );
              return;
            }
            res.redirect("/person/view/v");
          });
        }
      }
    );
  },
  update: (req, res) => {
    var loginid = req.params.logId;
    db.query(
      "SELECT * FROM person WHERE loginid = ? ",
      [loginid],
      (err, person) => {
        console.log(person);
        if (err) throw err;
        var context = {
          action: "/person/update_process",
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "personCU.ejs",
          logined: "YES",
          action: "/person/update_process",
          persons: person,
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      }
    );
  },
  update_process: (req, res) => {
    var loginid = req.body.loginid;
    var password = req.body.password;
    var name = req.body.name;
    var address = req.body.address;
    var tel = req.body.tel;
    var birth = req.body.birth;
    var cla = req.body.class;
    var point = req.body.point;
    db.query(
      "UPDATE person SET password=?, name=?, address=?,tel=?,birth=?,class=?,point=? WHERE loginid=? ",
      [password, name, address, tel, birth, cla, point, loginid],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(
            `<script>alert('값을 확인해 주세요.'); window.location.href='/person/update/${loginid}';</script>`
          );
          return;
        }
        res.redirect("/person/view/u");
      }
    );
  },
  delete_process: (req, res) => {
    var loginid = req.params.logId;

    db.query(
      "DELETE FROM person WHERE loginid = ?",
      [loginid],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(
            "<script>alert('삭제에 실패했습니다.'); window.location.href='/person/view/u';</script>"
          );
          return;
        }
        res.redirect("/person/view/u");
      }
    );
  },
};
