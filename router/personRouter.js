// 201935325-이호성
const express = require("express");
var router = express.Router();
var person = require("../lib/person");

router.get("/view/:vu", (req, res) => {
  person.view(req, res);
});
router.get("/create", (req, res) => {
  person.create(req, res);
});

router.post("/create_process", (req, res) => {
  person.create_process(req, res);
});

router.get("/update/:logId", (req, res) => {
  person.update(req, res);
});
router.post("/update_process", (req, res) => {
  person.update_process(req, res);
});
router.get("/delete/:logId", (req, res) => {
  person.delete_process(req, res);
});

module.exports = router;
