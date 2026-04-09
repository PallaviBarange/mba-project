const Booking = require("../models/Booking");
const Movie = require("../models/Movie");

function getAllSeats() {
  const rows = ["A", "B", "C", "D", "E"];
  const seats = [];
  rows.forEach(row => {
    for (let i = 1; i <= 10; i++) {
      seats.push(row + i);
    }
  });
  return seats;
}

exports.showBooking = async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.send("Movie not found");

    const bookings = await Booking.find({ movieId });

    let bookedSeats = [];
    bookings.forEach(b => {
      bookedSeats = bookedSeats.concat(b.seats);
    });

    const allSeats = getAllSeats();

    res.render("users/booking", {
      movie,
      bookedSeats,
      allSeats
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading booking page");
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const userId = req.session.userId;

    if (!req.body.seats) return res.send("No seats selected");

    const seats = req.body.seats.split(",");

    const existingBookings = await Booking.find({ movieId });
    let alreadyBooked = [];
    existingBookings.forEach(b => alreadyBooked = alreadyBooked.concat(b.seats));

    const conflict = seats.some(seat => alreadyBooked.includes(seat));
    if (conflict) return res.send("One or more seats already booked");

    const booking = new Booking({ userId, movieId, seats });
    await booking.save();


    const movie = await Movie.findById(movieId);

    req.session.lastBooking = {
      movieName: movie.name,
      seats
    };

    res.redirect("/user/booking-success");
  } catch (err) {
    console.log(err);
    res.send("Booking failed");
  }
};

exports.myBookings = async (req, res) => {
  try {
    const userId = req.session.userId;
    const bookings = await Booking.find({ userId });
    res.send(bookings);
  } catch (error) {
    console.log(error);
    res.send("Error fetching bookings");
  }
};