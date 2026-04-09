const express = require("express");
const router = express.Router();

const theatreController = require("../controllers/theatreController");

module.exports = (upload) => {

  router.get("/signup", theatreController.showSignup);
  router.post("/signup", theatreController.handleSignup);
  router.get("/login", theatreController.showLogin);
  router.post("/login", theatreController.handleLogin);

  router.get("/dashboard", theatreController.dashboard);

  router.get("/add-movie", theatreController.showAddMovie);
  router.post("/add-movie", upload.single("image"), theatreController.addMovie);

  router.get("/edit-movie/:id", theatreController.showEditMovie);
  router.post("/edit-movie/:id", upload.single("image"), theatreController.updateMovie);

  router.get("/delete-movie/:id", theatreController.deleteMovie);
  router.post("/delete-movie/:id", theatreController.deleteMovie);

  router.get("/logout", theatreController.logout);

  return router;
};
