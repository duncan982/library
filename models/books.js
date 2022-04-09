const mongoose = require('mongoose');

const books = new mongoose.Schema({
  title: String,
  comments: [],
})

const Books = mongoose.model("Books", books);

module.exports = { Books }