var express = require("express");
var multer = require("multer");

var controller = require("../controllers/user.controller");
var validate = require("../validate/user.validate");
var authMiddleware = require("../middleware/auth.middleware");
var storage = multer.memoryStorage();
var upload = multer({storage: storage})

var router = express.Router();

router.get("/", authMiddleware.requireAuth, controller.usersList);

router.get("/add", controller.add);

router.post("/add", validate.validateUser, controller.addPOST);

router.get("/update-name/:id", controller.update);

router.get("/delete/:id", controller.delete);

router.post("/update-name/:id", controller.updatePOST);

router.get('/profile', controller.profile);

router.get('/profile/avatar', controller.avatar)

router.post('/profile/avatar', upload.single('avatar'), controller.avatarPOST)

module.exports = router;
