const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const tagSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    descriptions: {
      type: String,
      select: false,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Tag', tagSchema);
