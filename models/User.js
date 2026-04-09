const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);