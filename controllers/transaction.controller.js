var db = require("../db");
var shortid = require("shortid");

module.exports.transactionsList = (req, res) => {
  var users = db.get("usersList").value();
  var books = db.get("booksList").value();
  var transactionsList = db.get("transactionsList").value();
  var authUser = db
    .get("usersList")
    .find({ id: req.signedCookies.userId })
    .value();

  if (!authUser.isAdmin) {
    transactionsList = db
      .get("transactionsList")
      .filter({ userId: authUser.id })
      .value();
  }

  var mapUserName = function(userId) {
    return db
      .get("usersList")
      .find({ id: userId })
      .value().name;
  };

  var mapBookTitle = function(bookId) {
    return db
      .get("booksList")
      .find({ id: bookId })
      .value().title;
  };

  var finalTransList = transactionsList.map(function(tranx) {
    var id = tranx.id;
    var userName = mapUserName(tranx.userId);
    var bookTitle = mapBookTitle(tranx.bookId);
    var isComplete = tranx.isComplete;
    return { id, userName, bookTitle, isComplete };
  });

  res.render("transactions/transactions-list", {
    transactionsList: finalTransList
  });
};

module.exports.create = function(req, res) {
  const users = db.get("usersList").value();
  const books = db.get("booksList").value();
  res.render("transactions/create", {
    books,
    users
  });
};

module.exports.createPOST = function(req, res) {
  var id = shortid();
  db.get("transactionsList")
    .push({
      id: id,
      bookId: req.body.bookId,
      userId: req.body.userId
    })
    .value();
  db.get("transactionsList").write();
  res.redirect("/transactions");
};

module.exports.complete = function(req, res) {
  var id = req.params.id;
  var idExist = db
    .get("transactionsList")
    .filter({ id: id })
    .value();
  var errors = [];
  if (!idExist == []) {
    errors.push("ID not exist, please check again !");
  }
  console.log(errors);
  if (errors.length) {
    res.render("transactions/transactions-list", {
      errors: errors,
      transactionsList: db.get("transactionsList").value()
    });
    return;
  }

  db.get("transactionsList")
    .find({ id: id })
    .assign({ isComplete: true })
    .write();
  res.redirect("/transactions");
};
