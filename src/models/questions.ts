import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;

interface QuestionDoc extends Document {
  title: number;
  description: string;
  questioner: string;
  topics: string;
}

const questionSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    questioner: {
      // type: String,
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    topics: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Topic',
        },
      ],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<QuestionDoc>('Question', questionSchema);
