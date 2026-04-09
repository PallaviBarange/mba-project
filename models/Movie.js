const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  theatreName: { type: String },
  name: String,
  description: String,
  hero: String,
  heroine: String,
  director: String,
  duration: String,
  time: String,
  image: String,
  status: Number,
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre"
  }
});

module.exports = mongoose.model("Movie", movieSchema);
