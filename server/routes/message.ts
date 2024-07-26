import { WebSocket } from "ws";
import type { IMessage } from "../type/typeDefinition";

import { User, Message } from "../model";

export const sendMessage = async (
  payload: IMessage,
  sender: WebSocket,
  reciever: WebSocket
) => {
  try {
    console.log("payload: ", payload);
    const user = await User.findOne({ _id: payload.sender }).exec();
    if (!user) {
      console.error("User not found");
      sender.send(JSON.stringify({ type: "message-send", payload: "failed" }));
      return;
    }

    const receiver = await User.findOne({ _id: payload.receiver }).exec();
    if (!receiver) {
      console.error("Receiver not found");
      sender.send(JSON.stringify({ type: "message-send", payload: "failed" }));
      return;
    }

    const message = new Message({
      sender: user,
      receiver: receiver,
      message: payload.message,
      date: new Date(),
      time: new Date().toLocaleTimeString(),
    });

    await message.save();
    sender.send(
      JSON.stringify({
        type: "message-send",
        payload: "success",
        sender: payload.sender,
        receiver: payload.receiver,
      })
    );

    reciever.send(
      JSON.stringify({
        type: "message",
        payload: payload.message,
        sender: payload.sender,
      })
    );
  } catch (err) {
    console.error("Failed to find user:", err);
    sender.send(JSON.stringify({ type: "message", payload: "failed" }));
  }
};
