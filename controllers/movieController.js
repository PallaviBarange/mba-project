const Movie = require("../models/Movie");
const Booking = require("../models/Booking");

exports.showBooking = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const movieId = req.params.movieId || req.params.id;

    const movie = await Movie.findById(movieId).populate("theatreId");
    if (!movie) {
      return res.send("Movie not found");
    }

    const bookings = await Booking.find({ movieId });
    let bookedSeats = [];
    bookings.forEach(b => {
      bookedSeats = bookedSeats.concat(b.seats);
    });

    res.render("users/booking", {
      movie,
      bookedSeats
    });
  } catch (error) {
    console.log(error);
    res.send("Error loading booking page");
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const { movieId, seats } = req.body;

    if (!seats || seats.length === 0) {
      return res.send("Please select seats");
    }

    const seatArray = Array.isArray(seats) ? seats : seats.split(",");

    const existingBookings = await Booking.find({ movieId });
    let alreadyBooked = [];
    existingBookings.forEach(b => {
      alreadyBooked = alreadyBooked.concat(b.seats);
    });

    const conflict = seatArray.some(seat => alreadyBooked.includes(seat));
    if (conflict) {
      return res.send("One or more selected seats are already booked");
    }

    const booking = new Booking({
      userId: req.session.userId,
      movieId,
      seats: seatArray
    });

    await booking.save();

    res.send(`
      <div class="alert alert-success alert-dismissible fade show">
        Seats booked successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
      <a href="/user/dashboard">Go back to dashboard</a>
    `);
  } catch (error) {
    console.log(error);
    res.send("Error booking seats");
  }
};  