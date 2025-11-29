const express = require("express");
const controller = require("./donation.controller");
const { authUser, authRole } = require("../middlewares/auth");
const router = express.Router();

router.get("/", controller.getDonations);

router.use(authUser, authRole("Coordinator"));
router.post("/", controller.createDonation);
router.put("/:id", controller.updateDonation);
router.delete("/:id", controller.deleteDonation);

module.exports = router;
