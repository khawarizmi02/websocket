import type { WsUser } from "../type/typeDefinition";

export const findUser = (online_users: WsUser[], id: string) => {
  // find only one user
  const user: WsUser | undefined = online_users.find((user) => user.id === id);

  return user ? user.ws : null;
};
