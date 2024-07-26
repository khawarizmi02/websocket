export interface LoginData {
  type: string;
  payload: {
    username: string;
    password: string;
  };
}

export interface RegisterData {
  type: string;
  payload: {
    username: string;
    password: string;
  };
}

export interface MessageData {
  type: string;
  payload: {
    message: string;
    sender: string;
    receiver: string;
  };
}

export interface IMessage {
  message: string;
  sender: string;
  receiver: string;
}

export interface IUser {
  username: string;
  password: string;
}

export interface WsUser {
  id: string;
  ws: WebSocket;
  userId: string;
}
