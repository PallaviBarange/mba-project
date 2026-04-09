const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bookingController = require("../controllers/bookingController");
const { isUserAuth } = require("../controllers/userAuth");

router.get("/signup", userController.showSignup);
router.post("/signup", userController.handleSignup);

router.get("/login", userController.showLogin);
router.post("/login", userController.handleLogin);

router.get("/dashboard", isUserAuth, userController.userDashboard);
router.get("/logout", userController.logout);

router.get("/booking/:movieId", isUserAuth, bookingController.showBooking);
router.post("/confirm-booking/:movieId", isUserAuth, bookingController.confirmBooking);

router.get("/my-bookings", isUserAuth, bookingController.myBookings);

router.get("/booking-success", isUserAuth, (req, res) => {
  res.render("users/booking-success");
});

module.exports = router;