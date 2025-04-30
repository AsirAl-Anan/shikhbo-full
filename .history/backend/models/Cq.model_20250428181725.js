import express from 'express';
import mongoose, { Schema } from 'mongoose';

const CqSchema = new Schema({
    stem: {
        type: String,
        required: true
    },
    a: {
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },
    b: {
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },
    c: {
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },
    d: {
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },
    correctAnswer: {
        type: String,
        required: true
    },
});

export default mongoose.model('Cq', CqSchema);
