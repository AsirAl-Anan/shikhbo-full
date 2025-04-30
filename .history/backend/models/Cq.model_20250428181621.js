import express from 'express';
import mongoose from 'mongoose';
import {Schema} from 'mongoose';
const CqSchema  = new Schema({
    stem:{
        type:String,
        required:true
    },
   a:{
    question:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    b:{
        question:{
            type:String,
            required:true
        },
        answer:{
            type:String,
            required:true
        }
    },
    
})