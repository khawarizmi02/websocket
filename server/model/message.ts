import mongoose from "mongoose";
import { User } from "./user";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: String,
  date: Date,
  time: String,
});

export const Message = mongoose.model("Message", messageSchema);
