const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  longURL: { type: String, required: true },
  shortURL: { type: String, required: true, unique: true },
  expirationDate: { type: Date },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Url", urlSchema);
