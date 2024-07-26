import mongoose from "mongoose";
import { User } from "../model";
import { password } from "bun";

import type { IUser } from "../type/typeDefinition";

export const accountLogin = async (payload: IUser, ws: WebSocket) => {
  try {
    const user = await User.findOne({ username: payload.username }).exec();
    if (!user) {
      console.error("User not found");
      ws.send(JSON.stringify({ type: "login", payload: "failed" }));
      return;
    }

    const match = await password.verify(payload.password, user.password ?? "");
    if (!match) {
      console.error("Password mismatch");
      ws.send(JSON.stringify({ type: "login", payload: "failed" }));
      return;
    }

    if (user) {
      console.error("User found");
      ws.send(JSON.stringify({ type: "login", payload: "success" }));
      return user.id;
    }
  } catch (err) {
    console.error("Failed to find user:", err);
    ws.send(JSON.stringify({ type: "login", payload: "failed" }));
  }
};
