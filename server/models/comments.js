const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    content: {
      type: String,
      required: true,
    },
    commentator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      select: false,
    },
    rootCommentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model('Comment', commentSchema);
