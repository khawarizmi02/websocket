import { WebSocket } from "ws";
import user from "./loginuser2.json";
import message from "./message.json";

import { sendMessage } from "./message";

import type {
  User,
  loginData,
  ILogin,
  IMessage,
  IMessageSend,
  Message,
} from "./type/typeDefinition";

const ws = new WebSocket("ws://localhost:3000");

const messageformat: Message = message as Message;
const userData: User = user as User;
type Data = ILogin | IMessage | IMessageSend;

ws.on("open", function open() {
  console.log("Connected to the server");
  const data = {
    type: "login",
    payload: {
      username: userData["user-name"],
      password: userData.password,
    },
  };
  ws.send(JSON.stringify(data));
});

ws.on("message", function message(msg: any) {
  const data = JSON.parse(msg) as Data;

  if (data.type === "login") {
    if (data.payload === "success") {
      console.log("Login successful");
      // sendMessage(messageformat, ws);

      const data = {
        type: "message",
        payload: {
          sender: messageformat.sender,
          receiver: messageformat.receiver,
          message: messageformat.message,
        },
      };

      console.log("Sending message: %s", JSON.stringify(data));
      ws.send(JSON.stringify(data));
    } else {
      console.log("Login failed");
    }
  }

  if (data.type === "message-send") {
    if (data.payload === "success") {
      console.log("Message sent successfully");
    } else {
      console.log("Message failed to send");
    }
  }

  if (data.type === "message") {
    const messageData = data as IMessage;
    console.log("Message received from: ", messageData.sender);
    console.log("Message received: ", messageData.payload);
  }
});

ws.on("close", function close() {
  console.log("Disconnected from the server");
});

ws.on("error", function error(err) {
  console.error("Failed to connect to the server:", err);
});
