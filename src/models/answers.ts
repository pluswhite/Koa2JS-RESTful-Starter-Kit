import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;

interface AnswerDoc extends Document {
  content: string;
  answerer: string;
  questionId: string;
  voteCount: number;
}

const answerSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false,
    },
    content: {
      type: String,
      required: true,
    },
    answerer: {
      // type: String,
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    questionId: {
      type: String,
      required: true,
    },
    voteCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model<AnswerDoc>('Answer', answerSchema);
