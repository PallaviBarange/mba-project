require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const mongoose = require("mongoose");

const theatreRoutes = require("./routes/theatreRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const dbConnectionUri = process.env.MONGO_URI;

if (!dbConnectionUri) {
  console.error("MONGO_URI not found in .env file");
  process.exit(1);
}

console.log("MONGO_URI Loaded");

// Session middleware
app.use(
  session({
    secret: "movie",
    resave: false,
    saveUninitialized: false
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("images"));

// View engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("MBA Project Backend is Running Successfully!");
});

app.use("/theatre", theatreRoutes(upload));
app.use("/user", userRoutes);

// MongoDB connection
mongoose
  .connect(dbConnectionUri)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 3004;
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });