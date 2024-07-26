import WebSocket, { type RawData } from "ws";
import user from "./user.json";
import type { loginData } from "./type/typeDefinition";

const ws = new WebSocket("ws://localhost:3000");
let hasLoggedIn = false;

ws.on("open", function open() {
  console.log("Connected to the server");
  const data = {
    type: "register",
    payload: {
      username: user["user-name"],
      password: user.password,
    },
  };
  ws.send(JSON.stringify(data));
});

ws.on("message", function message(data: RawData) {
  const dataString = data.toString();

  console.log("Received: %s", dataString);

  const login: loginData = JSON.parse(dataString);
  if (login.payload === "success" && !hasLoggedIn) {
    const loginData = {
      type: "login",
      payload: {
        username: user["user-name"],
        password: user.password,
      },
    };
    ws.send(JSON.stringify(loginData));
    hasLoggedIn = true;
  }
});

ws.on("close", function close() {
  console.log("Disconnected from the server");
});

ws.on("error", function error(err) {
  console.error("Failed to connect to the server:", err);
});
