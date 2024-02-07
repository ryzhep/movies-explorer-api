const mongoose = require("mongoose");

// Импорт валидатора
const isEmail = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: "Некорректный адрес электронной почты",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
  },
  {
    toJSON: { useProjection: true },
    toObject: { useProjection: true },
    versionKey: false,
  }
);

module.exports = mongoose.model("user", userSchema);
