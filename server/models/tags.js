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
  },
  {
    timestamps: true,
  },
);

module.exports = model('Tag', tagSchema);
