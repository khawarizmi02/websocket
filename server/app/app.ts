require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { WebSocketServer } = require("ws");

import { v4 as uuidv4 } from "uuid";

import type {
  LoginData,
  RegisterData,
  MessageData,
  IUser,
  IMessage,
  WsUser,
} from "../type/typeDefinition";

import { accountLogin, accountRegister, sendMessage } from "../routes";
import { findUser } from "./findUser";

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

const clientMap = new Map();

mongoose.connect(MONGODB_URL);

const database = mongoose.connection;
database.on("error", console.error.bind(console, "connection error:"));
database.once("open", () => {
  console.log("Database connected");
});

app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);

function onSocketPreError(e: Error) {
  console.log(e);
}

function onSocketPostError(e: Error) {
  console.log(e);
}

const s = server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ noServer: true });
let online_users: WsUser[] = [];

s.on(
  "upgrade",
  (
    req: { headers: { [x: string]: any } },
    socket: {
      on: (arg0: string, arg1: (e: Error) => void) => void;
      write: (arg0: string) => void;
      destroy: () => void;
      removeListener: (arg0: string, arg1: (e: Error) => void) => void;
    },
    head: any
  ) => {
    socket.on("error", onSocketPreError);

    // handle auth
    if (!!req.headers["BadAuth"]) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws: any) => {
      socket.removeListener("error", onSocketPreError);
      wss.emit("connection", ws, req);
    });
  }
);

wss.on("connection", (ws: any, req: any) => {
  ws.on("error", onSocketPostError);

  const id = uuidv4();

  clientMap.set(id, ws);

  console.log("Connection established with ID: ", id);
  online_users.push({ id: "", ws: ws, userId: id });

  type Data = LoginData | RegisterData | MessageData;

  ws.on("message", async (msg: any, isBinary: any) => {
    const senderId = clientMap.get(id);
    const data: Data = JSON.parse(msg);
    console.log(
      "online users: ",
      online_users.map((user) => ({ id: user.id, userId: user.userId }))
    );
    console.log("type: ", data.type);

    if (data.type === "login") {
      let result_id = await accountLogin(data.payload as IUser, ws);
      // online_users.push(result_id);
      const userIndex = online_users.findIndex((user) => user.ws === ws);
      online_users[userIndex].id = result_id;
    }
    if (data.type === "register")
      await accountRegister(data.payload as IUser, ws);

    if (data.type === "message") {
      console.log("message");

      const message = data as MessageData;

      const sender = findUser(online_users as WsUser[], message.payload.sender);

      if (!sender) {
        console.error("Sender not found");
      } else {
        await sendMessage(data.payload as IMessage, ws, sender as any);
      }
    }

    console.log("after login");
    console.log("online users count : ", online_users.length);
    console.log(
      "online users : ",
      online_users.map((user) => ({ id: user.id, userId: user.userId }))
    );

    // wss.clients.forEach((client: any) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(msg, { binary: isBinary });
    //   }
    // });
  });

  ws.on("close", () => {
    console.log("Connection closed");
    online_users = online_users.filter((user) => user.ws !== ws);
    clientMap.delete(id);

    console.log("online users count : ", online_users.length);
    console.log(
      "online users : ",
      online_users.map((user) => ({ id: user.id, userId: user.userId }))
    );
  });
});
