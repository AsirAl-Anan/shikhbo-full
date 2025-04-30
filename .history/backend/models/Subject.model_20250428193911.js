import express from 'express';
import mongoose, { Schema } from 'mongoose';

const SubjectSchema = new Schema({
    name:{
        
        type: String,
        required: true
    },
    chapter
})