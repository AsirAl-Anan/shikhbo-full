import mongoose from "mongoose";
import { Schema } from "mongoose";


const  chatSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   
    chatName: { type: String }, //needs to be changed
    
  },
  { timestamps: true } )


const Chat = mongoose.model("Chat", chatSchema);
export default Chat