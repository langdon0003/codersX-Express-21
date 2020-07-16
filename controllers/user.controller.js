const db = require("../db");

const shortid = require("shortid");

const cloudinary = require('cloudinary').v2;

module.exports.usersList = function(req, res) {
  var pageNumber = parseInt(req.query.page) || 0;
  console.log(pageNumber)
  var perPage = 5;
  res.render("users/users-list", {
    usersList: db
      .get("usersList")
      .drop((pageNumber-1)*perPage)
      .take(perPage)
      .value(),
    pageNumber: pageNumber.toString()
  });
};

module.exports.add = function(req, res) {
  res.render("users/add");
};

module.exports.addPOST = function(req, res) {
  cloudinary.uploader.upload(req.body.avatar);
  var id = shortid();
  
  
  db.get("usersList")
    .push({ 
      id: id,
      name: req.body.name, 
      phone: req.body.phone, 
      avatar: req.body.url
  })
    .write();
  
  
  res.redirect(`/users/${id}`);
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
