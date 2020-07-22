var db = require("../db");
var shortid = require("shortid");

function paginateNumbers(current) {
  if (current <= 2) return [1, 2, 3];
  var start = current - 1;
  const arr = new Array(3).fill();
  return arr.map(() => start++);
}


module.exports.usersList = function(req, res) {
  var pageNumber = parseInt(req.query.page) || 0;
  var currentPaginate = [1, 2, 3];
  var perPage = 5;
  res.render("users/users-list", {
    usersList: db
      .get("usersList")
      .drop((pageNumber-1)*perPage)
      .take(perPage)
      .value(),
    pages: paginateNumbers(pageNumber),
  });
};

module.exports.add = function(req, res) {
  res.render("users/add");
};

module.exports.addPOST = function(req, res) {
  var id = shortid();
  db.get("usersList")
    .push({ id: id, name: req.body.name, phone: req.body.phone })
    .value();
  db.get("usersList").write();
  res.redirect("/users");
};

module.exports.update = function(req, res) {
  res.render("users/update-name", {
    currentNameID: req.params.id,
    currentName: db
      .get("usersList")
      .find({ id: req.params.id })
      .value().name
  });
};

module.exports.delete = function(req, res) {
  var id = req.params.id;
  db.get("usersList")
    .remove({ id: id })
    .write();
  res.redirect("/users");
};

module.exports.updatePOST = function(req, res) {
  var id = req.params.id;
  db.get("usersList")
    .find({ id: id })
    .assign({ name: req.body.name })
    .write();
  res.redirect("/users");
};
