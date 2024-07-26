import mongoose from "mongoose";
import { User } from "../model";
import { password } from "bun";
import { WebSocket } from "ws";

import type { IUser } from "../type/typeDefinition";

export const accountRegister = async (payload: IUser, ws: WebSocket) => {
  const hashedPassword = await password.hash(payload.password);

  const user = new User({
    username: payload.username,
    password: hashedPassword,
  });

  try {
    const save = await user.save();
    console.log("User saved successfully");
    ws.send(
      JSON.stringify({ type: "register", payload: "success", data: save })
    );
  } catch (error) {
    console.error("Failed to save user:", error);
    ws.send(JSON.stringify({ type: "register", payload: "failed" }));
  }
};
