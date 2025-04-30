import express from 'express';
import mongoose, { Schema } from 'mongoose';

const SubjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  chapters: [
    {
      name: {
        type: String,
        required: true,
      },
      topics: [
        {
          type: String,
          required: true,
        }
      ]
    }
  ]
});

const Subject = mongoose.model('Subject', SubjectSchema);
export default Subject;
