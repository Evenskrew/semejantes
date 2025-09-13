const express = require("express");
const controller = require("./user.controller");
const { authUser } = require("./../middlewares/auth");

const router = express.Router();
router.use(authUser);

router.get("/", controller.getUsers);
router.get("/:id", controller.getUser);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;
