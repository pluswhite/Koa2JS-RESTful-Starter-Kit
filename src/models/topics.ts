/* eslint-disable @typescript-eslint/camelcase */
import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;

interface TopicDoc extends Document {
  name: string;
  avatar_url: string;
  introduction: string;
}

const topicSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    name: {
      type: String,
      required: true,
    },
    avatar_url: {
      type: String,
    },
    introduction: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<TopicDoc>('Topic', topicSchema);
