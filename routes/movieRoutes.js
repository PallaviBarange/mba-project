const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.get("/book/:id", movieController.showBooking);
router.post("/confirm-booking", movieController.confirmBooking);

module.exports = router;