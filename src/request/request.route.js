const express = require("express");
const controller = require("./request.controller");
const { authUser, authRole } = require("../middlewares/auth");
const router = express.Router();

router.use(authUser);

router.post("/", controller.createRequest);
router.get("/", controller.getRequests);
router.patch(
  "/:id/resolve",
  authRole("Coordinator"),
  controller.resolveRequest
);

module.exports = router;
