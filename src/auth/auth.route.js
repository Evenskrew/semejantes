const express = require("express");
const controller = require("./auth.controller");

const router = express.Router();

router.post("/sign-up", controller.signUp);
router.post("/sign-in", controller.signIn);

module.exports = router;
