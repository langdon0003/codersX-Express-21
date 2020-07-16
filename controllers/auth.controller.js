var md = require("md5");
var bcrypt = require("bcrypt");
var saltRounds = 10;

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var db = require("../db");

module.exports.login = function(req, res) {
  res.render("auth/login");
};

module.exports.postLogin = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var user = db
    .get("usersList")
    .find({ email: email })
    .value();

  if (!user) {
    res.render("auth/login", {
      errors: ["User does not exist !"],
      values: req.body
    });
    return;
  }

  const msg = {
    to: user.email,
    from: process.env.SENDGRID_EMAIL,
    subject: "Security alert: new or unusual login",
    text:
      "Looks like there was a login attempt from a new device or location. Your account has been locked.",
    html: "<strong>Your account has been locked.</strong>"
  };

  if (!user.wrongLoginCount) {
    user.wrongLoginCount = 0;
  }

  if (user.wrongLoginCount >= 4) {
    sgMail.send(msg);
    res.render("auth/login", {
      errors: ["Your account is locked! You have type wrong password 4 times!"],
      values: req.body
    });
    return;
  }

  if (!bcrypt.compareSync(password, user.password)) {
    db.get("usersList")
      .find({ email: email })
      .assign({ wrongLoginCount: ++user.wrongLoginCount })
      .write();

    res.render("auth/login", {
      errors: ["Wrong password !"],
      values: req.body
    });
    return;
  }

  res.cookie("userId", user.id, {
    signed: true
  });
  res.redirect("/transactions");
};
