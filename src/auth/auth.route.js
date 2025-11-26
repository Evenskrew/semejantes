const express = require("express");
const controller = require("./auth.controller");
const { handleValidationErrors } = require("../middlewares/validateHelper"); //
const {
  validateSignUpCoordinator,
  validateSignUpVolunteer,
} = require("./auth.validate.js");

const router = express.Router();

router.post(
  "/sign-up-coordinator",
  validateSignUpCoordinator,
  handleValidationErrors,
  controller.signUpCoordinator
);
router.post(
  "/sign-up-volunteer",
  validateSignUpVolunteer,
  handleValidationErrors,
  controller.signUpVolunteer
);
router.post("/sign-in", controller.signIn);

module.exports = router;
