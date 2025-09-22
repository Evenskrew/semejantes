const express = require("express");
const controller = require("./event.controller");
const { authUser, authRole } = require("../middlewares/auth");

const router = express.Router();

router.post("/", authUser, authRole("Coordinator"), controller.createEvent);
router.get("/", authUser, controller.getEvents);
router.patch(
  "/:id/participate",
  authUser,
  authRole("Volunteer"),
  controller.participateEvent
);
router.delete(
  "/:id",
  authUser,
  authRole("Coordinator"),
  controller.deleteEvent
);

module.exports = router;
