const bcrypt = require("bcrypt");
const mongoose = require("mongoose");   
const Theatre = require("../models/Theatre");
const Movie = require("../models/Movie");

exports.showSignup = (req, res) => {
  res.render("theatres/signup");
};

exports.handleSignup = (req, res) => {
  const { theatreName, email, password, address, city, state } = req.body;

  bcrypt.hash(password, 10).then(hashedPassword => {
    const theatre = new Theatre({
      theatreName,
      email,
      password: hashedPassword,
      address,
      city,
      state
    });

    theatre.save()
      .then(() => res.redirect("/theatre/login"))
      .catch(err => {
        console.log(err);
        res.render("theatres/signup");
      });
  });
};
exports.showLogin = (req, res) => {
  res.render("theatres/login");
};

exports.handleLogin = (req, res) => {
  const { email, password } = req.body;

  Theatre.findOne({ email })
    .then(theatre => {
      if (!theatre) return res.render("theatres/login");

      bcrypt.compare(password, theatre.password).then(match => {
        if (match) {
          req.session.theatreId = theatre._id;
          req.session.theatreName = theatre.theatreName;
          res.redirect("/theatre/dashboard");
        } else {
          res.render("theatres/login");
        }
      });
    })
    .catch(error => console.log(error));
};

exports.dashboard = (req, res) => {
  Movie.find({ theatreId: req.session.theatreId })
    .then(movies => {
      res.render("theatres/addMovie", {
        theatreName: req.session.theatreName,
        movies,
        message: ""
      });
    })
    .catch(error => console.log(error));
};

exports.showAddMovie = (req, res) => {
  Movie.find({ theatreId: req.session.theatreId })
    .then(movies => {
      res.render("theatres/addMovie", {
        theatreName: req.session.theatreName,
        movies,
        message: ""
      });
    })
    .catch(error => console.log(error));
};

exports.addMovie = (req, res) => {
  const { name, description, hero, heroine, director, duration, time } = req.body;
  const image = req.file ? req.file.filename : null;

  const movie = new Movie({
    name,
    description,
    hero,
    heroine,
    director,
    duration,
    time,
    image,
    status: 1,
    theatreId: req.session.theatreId,
    theatreName: req.session.theatreName
  });

  movie.save()
    .then(() => res.redirect("/theatre/add-movie"))
    .catch(err => {
      console.log(err);
      res.redirect("/theatre/add-movie");
    });
};

exports.deleteMovie = (req, res) => {
  const id = req.body.id; 

  Movie.findByIdAndDelete(id)
    .then(() => res.redirect("/theatre/add-movie"))
    .catch(error => console.log(error));
};

exports.showEditMovie = (req, res) => {
  const id = req.body.id; 

  Movie.findById(id)
    .then(movie => {
      res.render("theatres/editMovie", {
        theatreName: req.session.theatreName,
        movie
      });
    })
    .catch(error => console.log(error));
};

exports.updateMovie = (req, res) => {
  const { id, name, description, hero, heroine, director, duration, time } = req.body;
  const image = req.file ? req.file.filename : req.body.oldImage;

  Movie.findByIdAndUpdate(id, {
    name,
    description,
    hero,
    heroine,
    director,
    duration,
    time,
    image
  })
    .then(() => res.redirect("/theatre/add-movie"))
    .catch(error => console.log(error));
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/theatre/login"));
};