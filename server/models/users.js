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
      default: 'Guest',
    },
    email: {
      type: String,
      required: true,
      select: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      select: false,
    },
    gender: {
      type: Number,
      required: true,
      enum: [0, 1, 2],
      default: 0,
      select: false,
    },
    locations: {
      type: [
        {
          Type: String,
        },
      ],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = new model('User', userSchema);
