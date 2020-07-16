var db = require("../db");
var shortid = require("shortid");

module.exports.validateUser = function(req, res, next) {
  var id = shortid();
  var errors = [];

  if (req.body.name.length > 30) {
    errors.push("User name can not be longer than 30 characters!");
  }

  if (req.body.name.length == 0) {
    errors.push("User name can not be empty!");
  }
  console.log(req.body.name.length);

  if (errors.length) {
    res.render("users/add", {
      errors: errors
    });
    return;
  }

  next();
};
