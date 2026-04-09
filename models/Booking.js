const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
  seats: [String], 
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
