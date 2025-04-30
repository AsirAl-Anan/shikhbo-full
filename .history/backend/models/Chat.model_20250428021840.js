import mongoose from "mongoose";
import { Schema } from "mongoose";


const  chatSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    chatName: { type: String, required: true },
    
  },
  { timestamps: true } )


const Chat = mongoose.model("Chat", chatSchema);
export default Chat