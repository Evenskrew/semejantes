const express = require("express");
const controller = require("./auth.controller");

const router = express.Router();

const {
  validateSignUpCoordinator,
  validateSignUpVolunteer,
  handleValidationErrors,
} = require("./auth.validate.js");

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
