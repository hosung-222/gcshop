// 201935325-이호성
var db = require("./db");

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

    db.query("SELECT * FROM merchandise", (err, result) => {
      var context = {
        menu: isAdmin ? "menuForManager.ejs" : "menuForCustomer.ejs",
        who: req.session.name,
        body: "merchandise.ejs",
        logined: isOwner ? "YES" : "NO",
        merchandiseList: result,
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
      db.query("SELECT * FROM code_tbl", (err, code) => {
        if (err) throw err;
        console.log(code);
        var context = {
          menu: "menuForManager.ejs",
          who: req.session.name,
          body: "merchandiseCU.ejs",
          logined: "YES",
          categories: code,
          mode: "create",
        };
        req.app.render("home", context, (err, html) => {
          res.end(html);
        });
      });
    } else {
      res.send(
        "<script>alert('권한이 없습니다.'); window.location.href='/';</script>"
      );
      return;
    }
  },
  create_process: (req, res, image) => {
    var category = req.body.category;
    var name = req.body.name;
    var price = req.body.price;
    var stock = req.body.stock;
    var brand = req.body.brand;
    var supplier = req.body.supplier;
    var sale_yn = req.body.sale_yn;
    var sale_price = req.body.sale_price;
    console.log(category);
    var sql =
      "INSERT INTO merchandise (category, name, price, stock, brand, supplier, image, sale_yn, sale_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    var params = [
      category,
      name,
      price,
      stock,
      brand,
      supplier,
      image,
      sale_yn,
      sale_price,
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error(err);
        res.send(
          "<script>alert('값을 확인해주세요'); window.location.href='/merchandise/create';</script>"
        );
        return;
      }
      res.redirect("/merchandise/view/v");
    });
  },

  update: (req, res) => {
    var id = req.params.merId;
    var isOwner = authIsOwner(req, res);
    var isAdmin = authIsOwner(req, res);
    if (isAdmin) {
      db.query("SELECT * FROM code_tbl", (err, code) => {
        db.query(
          "select * from merchandise where mer_id =?",
          [id],
          (err, results) => {
            if (results.length > 0) {
              var context = {
                menu: isAdmin ? "menuForManager.ejs" : "menuForCustomer.ejs",
                who: req.session.name,
                body: "merchandiseCU.ejs",
                logined: isOwner ? "YES" : "NO",
                merchandise: results[0], // result를 merchandise로 수정
                mode: "update",
                categories: code,
              };
              req.app.render("home", context, (err, html) => {
                res.end(html);
              });
            } else {
              res.send(
                "<script>alert('상품을 찾을 수 없습니다.'); window.location.href='/merchandise/view/u';</script>"
              );
            }
          }
        );
      });
    } else {
      res.send(
        "<script>alert('권한이 없습니다.'); window.location.href='/merchandise/view/u';</script>"
      );
    }
  },

  update_process: (req, res) => {
    var id = req.body.mer_id; // 수정할 상품의 ID
    var category = req.body.category;
    var name = req.body.name;
    var price = req.body.price;
    var stock = req.body.stock;
    var brand = req.body.brand;
    var supplier = req.body.supplier;
    var sale_yn = req.body.sale_yn;
    var sale_price = req.body.sale_price;
    var image = req.body.image;
    console.log(id);
    db.query(
      "UPDATE merchandise SET category=?, name=?, price=?, stock=?, brand=?, supplier=?, sale_yn=?, sale_price=?, image=? WHERE mer_id=?",
      [
        category,
        name,
        price,
        stock,
        brand,
        supplier,
        sale_yn,
        sale_price,
        image,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          res.send(
            `<script>alert('값을 확인해주세요.'); window.location.href='/merchandise/view/u';</script>`
          );
          return;
        }
        console.log(result);
        res.redirect("/merchandise/view/u");
      }
    );
  },
  // ...
  delete_process: (req, res) => {
    var id = req.params.merId; // 삭제할 상품의 ID

    db.query("DELETE FROM merchandise WHERE mer_id=?", [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("상품 삭제에 실패했습니다.");
        return;
      }
      res.redirect("/merchandise/view/u");
    });
  },
};
