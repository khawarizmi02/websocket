export interface loginData {
  type: string;
  payload: string;
}

export interface User {
  "user-name": string;
  password: string;
}

export interface Message {
  sender: string;
  receiver: string;
  message: string;
}

export interface ILogin {
  type: string;
  payload: string;
}

export interface IMessage {
  type: string;
  payload: string;
  sender: string;
}

export interface IMessageSend {
  type: string;
  payload: string;
}
