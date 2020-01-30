const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
    },
    gender: {
      type: Number,
      required: true,
      enum: [0, 1, 2],
      default: 0,
    },
    locations: {
      type: [
        {
          Type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = new model('User', userSchema);
