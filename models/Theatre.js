const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema({
  theatreName: String,
  email: String,
  password: String,
  address: String,
  city: String,
  state: String
});

module.exports = mongoose.model("Theatre", theatreSchema);
