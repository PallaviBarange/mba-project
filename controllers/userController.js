const bcrypt = require("bcrypt");
const User = require("../models/User");
const Movie = require("../models/Movie");
const Booking = require("../models/Booking");
const Theatre = require("../models/Theatre");

exports.showSignup = (req, res) => res.render("users/signup");

exports.handleSignup = async (req, res) => {
  try {
    const { username, surname, email, password, gender, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("users/signup", { error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      surname,
      email,
      password: hashedPassword,
      gender,
      age
    });

    await user.save();

    res.redirect("/user/login");

  } catch (error) {
    console.log(error);
    res.render("users/signup", { error: "Signup failed" });
  }
};

exports.showLogin = (req, res) => res.render("users/login");

exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("users/login", { error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render("users/login", { error: "Invalid email or password" });
    }

    req.session.userId = user._id.toString();
    req.session.username = user.username;

    req.session.save(() => {
      res.redirect("/user/dashboard");
    });

  } catch (error) {
    console.log(error);
    res.render("users/login", { error: "Login failed" });
  }
};

exports.userDashboard = async (req, res) => {
  try {
    const selectedMovie = req.query.movie;

    let query = { status: 1 };
    if (selectedMovie) query.name = selectedMovie;

    const movies = await Movie.find(query);

    if (movies.length === 0) {
      return res.render("users/dashboard", {
        username: req.session.username,
        movies: [],
        movieNames: [],
        selectedMovie: "",
        successMsg: ""
      });
    }

    const finalMovies = await Promise.all(
      movies.map(async (movie) => {

        const bookings = await Booking.find({ movieId: movie._id });

        let totalBookedSeats = 0;
        bookings.forEach(b => {
          totalBookedSeats += b.seats.length;
        });

        movie.bookedSeatsCount = totalBookedSeats;

        const theatre = await Theatre.findById(movie.theatreId);
        movie.theatreName = theatre ? theatre.theatreName : "Unknown Theatre";

        return movie;
      })
    );

    const allMovieNames = movies.map(m => m.name);

    res.render("users/dashboard", {
      username: req.session.username,
      movies: finalMovies,
      movieNames: allMovieNames,
      selectedMovie: selectedMovie || "",
      successMsg: ""
    });

  } catch (error) {
    console.log(error);
    res.render("users/dashboard", {
      username: req.session.username,
      movies: [],
      movieNames: [],
      selectedMovie: "",
      successMsg: ""
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/user/login"));
};