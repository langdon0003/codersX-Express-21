const db = require("../db");

const shortid = require("shortid");
const dotenv = require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_keyapi_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.usersList = function(req, res) {
  var pageNumber = parseInt(req.query.page) || 0;
  var perPage = 5;
  res.render("users/users-list", {
    usersList: db
      .get("usersList")
      .drop((pageNumber - 1) * perPage)
      .take(perPage)
      .value(),
    pageNumber: pageNumber.toString()
  });
};

module.exports.add = function(req, res) {
  res.render("users/add");
};

module.exports.addPOST = async function(req, res) {
  var id = shortid();
  db.get("usersList")
    .push({
      id: id,
      name: req.body.name,
      phone: req.body.phone,
      avatarUrl: ""
    })
    .write();
  let cld_upload_stream = await cloudinary.uploader.upload_stream(
    {
      public_id: id + "_avatar",
      invalidate: true
    },
    (error, result) => {
      db.get("usersList")
        .find({ id: id })
        .assign({
          avatarUrl: result.url
        })
        .write();
      res.redirect("/users");
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
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

module.exports.profile = function(req, res) {
  var authUser = db
    .get("usersList")
    .find({ id: req.signedCookies.userId })
    .value();

  res.render("users/profile", {
    currentName: authUser.name,
    currrentAvatarUrl: authUser.avatarUrl,
    currentEmail: authUser.email,
    currentPhone: authUser.phone
  });
};

module.exports.avatar = function(req, res) {
  var authUser = db
    .get("usersList")
    .find({ id: req.signedCookies.userId })
    .value();
  res.render("users/avatar", {
    currentName: authUser.name,
    currrentAvatarUrl: authUser.avatarUrl
  });
};

module.exports.avatarPOST = async function(req, res) {
  var authUser = db
    .get("usersList")
    .find({ id: req.signedCookies.userId })
    .value();

  let cld_upload_stream = await cloudinary.uploader.upload_stream(
    {
      public_id: authUser.id + "_avatar",
      invalidate: true
    },
    (error, result) => {
      db.get("usersList")
        .find({ id: req.signedCookies.userId })
        .assign({ avatarUrl: result.url })
        .write();
      res.redirect("/users/profile");
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
};
