/* eslint-disable @typescript-eslint/camelcase */
import mongoose, { Document } from 'mongoose';

const { Schema, model } = mongoose;

interface UserDoc extends Document {
  name: string;
  password: string;
  avatar_url: string;
  gender: 'male' | 'female' | 'unknown';
  headline: string;
  location: string[];
  business: string;
  employee: [
    {
      company: string;
      job: string;
    },
  ];
  educations: [
    {
      school: string;
      major: string;
      diploma: 1 | 2 | 3 | 4 | 5;
      entrance_year: number;
      graduation_year: number;
    },
  ];
  following: string[];
  followingTopics: string[];
  likingAnswers: string[];
  dislikingAnswers: string[];
  collectingAnswers: string[];
}

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
    avatar_url: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      required: true,
      default: 'male',
    },
    headline: {
      type: String,
    },
    locations: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Topic',
        },
      ],
      // type: [
      //   {
      //     type: String,
      //   },
      // ],
      select: false,
    },
    business: {
      // type: String,
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      select: false,
    },
    employments: {
      type: [
        {
          company: {
            // type: String,
            type: Schema.Types.ObjectId,
            ref: 'Topic',
          },
          job: {
            // type: String,
            type: Schema.Types.ObjectId,
            ref: 'Topic',
          },
        },
      ],
      select: false,
    },
    educations: {
      select: false,
      type: [
        {
          school: {
            // type: String,
            type: Schema.Types.ObjectId,
            ref: 'Topic',
          },
          major: {
            // type: String,
            type: Schema.Types.ObjectId,
            ref: 'Topic',
          },
          diploma: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            default: 3,
          },
          entrance_year: {
            type: Number,
          },
          graduation_year: {
            type: Number,
          },
        },
      ],
    },
    following: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      select: false,
    },
    followingTopics: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Topic',
        },
      ],
      select: false,
    },
    likingAnswers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Answer',
        },
      ],
      select: false,
    },
    dislikingAnswers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Answer',
        },
      ],
      select: false,
    },
    collectingAnswers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Answer',
        },
      ],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<UserDoc>('User', userSchema);
