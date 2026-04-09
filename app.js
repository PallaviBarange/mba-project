const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const mongoose = require("mongoose");

const theatreRoutes = require("./routes/theatreRoutes");
const userRoutes = require("./routes/userRoutes"); 
const app = express();

const dbConnectionUri = process.env.MONGO_URI;

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
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage: fileStorage, limits: { fileSize: 5 * 1024 * 1024 } });

app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");

app.use("/theatre", theatreRoutes(upload)); 
app.use("/images", express.static("images"));
app.use("/user", userRoutes);

mongoose.connect(dbConnectionUri)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 3004;

    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });