import WebSocket from "ws";
import type { Message } from "./type/typeDefinition";

export const sendMessage = (message: Message, ws: WebSocket) => {
  console.log("Sending message to the server");
  const data = {
    type: "message",
    payload: {
      sender: message.sender,
      receiver: message.receiver,
      message: message.message,
    },
  };

  console.log("Sending: %s", JSON.stringify(data));

  try {
    ws.send(JSON.stringify(data));
  } catch (error) {
    console.log("Error sending message to the server");
  }
};

// const ws = new WebSocket("ws://localhost:3000");

// ws.on("open", function open() {
//   console.log("Connected to the server");
//   const data = {
//     type: "message",
//     payload: {
//       sender: message.sender,
//       receiver: message.receiver,
//       message: message.message,
//     },
//   };

//   console.log("Sending: %s", JSON.stringify(data));
//   ws.send(JSON.stringify(data));
// });
// ws.on("message", function message(data) {
//   console.log("Received: %s", data);
// });

// ws.on("close", function close() {
//   console.log("Disconnected from the server");
// });

// ws.on("error", function error(err) {
//   console.error("Failed to connect to the server:", err);
// });
