var db = require("../db");
var shortid = require("shortid");

module.exports.booksList = (req, res) => {
  res.render("books/books-list", {
    booksList: db.get("booksList").value()
  });
};

module.exports.add = function(req, res) {
  res.render("books/add");
};

module.exports.addPOST = function(req, res) {
  var id = shortid();
  db.get("booksList")
    .push({ id: id, title: req.body.title, desc: req.body.desc })
    .write();
  res.redirect("/books");
};

module.exports.update = function(req, res) {
  //console.log(Date.now(), req.params.id)
  res.render("books/update-title", {
    currentBookID: req.params.id,
    currentTitle: db
      .get("booksList")
      .find({ id: req.params.id })
      .value().title
  });
  // const book = db
  //     .get("booksList")
  //     .find({ id: req.params.id })
  //     .value()
  // console.log(book)
};

module.exports.delete = function(req, res) {
  var id = req.params.id;
  db.get("booksList")
    .remove({ id: id })
    .write();
  res.redirect("/books");
};

module.exports.updatePOST = function(req, res) {
  db.get("booksList")
    .find({ id: req.params.id })
    .assign({ title: req.body.title })
    .write();
  res.redirect("/books");
};
