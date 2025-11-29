const express = require("express");
const controller = require("./event.controller");
const { authUser, authRole } = require("../middlewares/auth");
const { handleValidationErrors } = require("../middlewares/validate.helper"); //
const { validateCreateEvent } = require("./event.validate.js");

const router = express.Router();

router.post(
  "/",
  authUser,
  authRole("Coordinator"),
  handleValidationErrors,
  controller.createEvent
);

router.get("/", controller.getEvents);

router.patch(
  "/:id/participate",
  authUser,
  authRole("Volunteer"),
  controller.participateEvent
);

router.put("/:id", authUser, authRole("Coordinator"), controller.updateEvent);

router.delete(
  "/:id",
  authUser,
  authRole("Coordinator"),
  controller.deleteEvent
);
router.get("/:id/certificate", authUser, controller.generateCertificate);
module.exports = router;
