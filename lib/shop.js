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
  home: (req, res) => {
    var isOwner = authIsOwner(req, res);
    var isAdmin = authIsAdmin(req, res);
    var vu = "v";
    db.query("SELECT * FROM merchandise", (err, result) => {
      var context = {
        menu: isAdmin ? "menuForManager.ejs" : "menuForCustomer.ejs",
        who: req.session.name,
        body: "merchandise.ejs",
        logined: isOwner ? "YES" : "NO",
        merchandiseList: result,
        vu: vu,
      };

      req.app.render("home", context, (err, html) => {
        res.end(html);
      });
    });
  },
};
