var express = require("express");

var controller = require("../controllers/transaction.controller");

var router = express.Router();

router.get("/", controller.transactionsList);

router.get("/create", controller.create);

router.post("/create", controller.createPOST);

router.get("/:id/complete", controller.complete);

module.exports = router;
