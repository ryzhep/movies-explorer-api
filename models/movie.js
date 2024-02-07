const mongoose = require("mongoose");

const isURL = require("validator/lib/isURL");

const moviesSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (image) => isURL(image),
      message: "Некорректный адрес URL",
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (trailer) => isURL(trailer),
      message: "Некорректный URL",
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (thumbnail) => isURL(thumbnail),
      message: "Некорректный URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  movieId: {
    required: true,
    type: Number,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("movies", moviesSchema);
