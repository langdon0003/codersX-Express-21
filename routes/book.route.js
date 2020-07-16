var express = require("express");

var controller = require("../controllers/book.controller");

var router = express.Router();

router.get("/", controller.booksList);

router.get("/add", controller.add);

router.post("/add", controller.addPOST);

router.get("/update-title/:id", controller.update);

router.get("/delete/:id", controller.delete);

router.post("/update-title/:id", controller.updatePOST);

module.exports = router;
