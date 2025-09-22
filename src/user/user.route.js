const express = require("express");
const controller = require("./user.controller");
const { authUser, authRole } = require("../middlewares/auth");

const router = express.Router();
router.use(authUser);

router.get("/available/:day", controller.getUsersByDay);
router.get("/", controller.getUsers);
router.get("/:id", controller.getUser);
router.patch("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;