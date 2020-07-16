// module.exports.sendCookie = (req, res, next) => {
//   res.cookie("userId", "1234554321");
//   next();
// };

let count = 0;
module.exports.countCookie = (req, res, next) => {
  // console.log(`<${req.cookies["userId"]}>: <${++count}>`);
  next();
};
