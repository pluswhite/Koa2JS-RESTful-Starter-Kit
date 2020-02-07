const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const categorySchema = new Schema(
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

module.exports = model('Category', categorySchema);
