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
    db.query("SELECT * FROM code_tbl", (err, codes) => {
      var context = {
        menu: isAdmin ? "menuForManager.ejs" : "menuForCustomer.ejs",
        who: req.session.name,
        body: "code.ejs",
        logined: isOwner ? "YES" : "NO",
        codes: codes,
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
        body: "codeCU.ejs",
        logined: "YES",
        action: "/code/create_process",
        code: [
          {
            main_name: "",
            sub_name: "",
            start: "",
            end: "",
          },
        ],
      };

      req.app.render("home", context, (err, html) => {
        res.end(html);
      });
    } else {
      res.status(403).send("권한이 없습니다.");
    }
  },
  create_process: (req, res) => {
    var main_id = req.body.main_id;
    var main_name = req.body.main_name;
    var sub_id = req.body.sub_id;
    var sub_name = req.body.sub_name;
    var start = req.body.start;
    var end = req.body.end;
    if (main_id == "" || sub_id == "") {
      res.send(
        "<script>alert('대분류 or 소분류 값을 입력하세요'); window.location.href='/code/create';</script>"
      );
      return;
    } else {
      db.query(
        "SELECT * FROM code_tbl WHERE main_id = ? AND sub_id = ?",
        [main_id, sub_id],
        (err, rows) => {
          if (err) {
            console.log(err);
          }
          if (rows.length > 0) {
            res.send(
              "<script>alert('동일한 대분류 소분류가 이미 존재합니다.'); window.location.href='/code/create';</script>"
            );
            return;
          } else {
            var sql =
              "INSERT INTO code_tbl (main_id, main_name, sub_id, sub_name, start, end) VALUES (?, ?, ?, ?, ?, ?)";
            var params = [main_id, main_name, sub_id, sub_name, start, end];

            db.query(sql, params, (err, result) => {
              if (err) {
                console.error(err);
                res.send(
                  "<script>alert('값을 확인해 주세요.'); window.location.href='/code/create';</script>"
                );
                return;
              }
              res.redirect("/code/view/v");
            });
          }
        }
      );
    }
  },

  update: (req, res) => {
    var main_id = req.params.main;
    var sub_id = req.params.sub;
    db.query(
      "SELECT * FROM code_tbl WHERE main_id = ? AND sub_id = ?",
      [main_id, sub_id],
      (err, code) => {
        console.log(code);
        if (err) throw err;
        var context = {
          action: "/code/update_process",
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "codeCU.ejs",
          logined: "YES",
          action: "/code/update_process",
          code: code,
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      }
    );
  },
  update_process: (req, res) => {
    var main_id = req.body.main_id;
    var main_name = req.body.main_name;
    var sub_id = req.body.sub_id;
    var sub_name = req.body.sub_name;
    var start = req.body.start;
    var end = req.body.end;
    console.log(main_id);
    db.query(
      "UPDATE code_tbl SET main_name=?, sub_name=?, start=?, end=? WHERE main_id=? AND sub_id = ?",
      [main_name, sub_name, start, end, main_id, sub_id],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("데이터를 수정하는 중 오류가 발생했습니다.");
          return;
        }
        res.redirect("/code/view/u");
      }
    );
  },

  delete_process: (req, res) => {
    var main_id = req.params.main;
    var sub_id = req.params.sub;

    db.query(
      "DELETE FROM code_tbl WHERE main_id = ? AND sub_id = ?",
      [main_id, sub_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send(
            "<script>alert('삭제에 실패했습니다.'); window.location.href='/code/view/u';</script>"
          );
          return;
        }
        res.redirect("/code/view/u");
      }
    );
  },
};
