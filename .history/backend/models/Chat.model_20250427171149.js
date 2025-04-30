import mongoose from "mongoose";
import { Schema } from "mongoose";


const  chatSchema = new Schema({
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      },
      { timestamps: true } 