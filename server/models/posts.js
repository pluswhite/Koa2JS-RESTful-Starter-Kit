const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    title: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    content: {
      type: String,
      select: true,
      require: true,
      default: '',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    tags: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Tag',
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Post', postSchema);
