const express = require("express");
const controller = require("./report.controller");
const { authUser, authRole } = require("../middlewares/auth");
const router = express.Router();

router.use(authUser, authRole("Coordinator"));

router.get("/monthly", controller.getMonthlyReport);
router.get("/annual", controller.getAnnualReport);

module.exports = router;
