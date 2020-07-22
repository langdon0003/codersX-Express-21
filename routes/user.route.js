var express = require("express");

var controller = require("../controllers/user.controller");

var validate = require("../validate/user.validate");

var authMiddleware = require("../middleware/auth.middleware");

var router = express.Router();

router.get("/", controller.usersList);

router.get("/add", controller.add);

router.post("/add", validate.validateUser, controller.addPOST);

router.get("/update-name/:id", controller.update);

router.get("/delete/:id", controller.delete);

router.post("/update-name/:id", controller.updatePOST);

module.exports = router;
