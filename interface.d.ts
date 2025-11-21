import { CreateChatProps } from "src/types";

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void;
  onUpdatedMessage: (callback: OnUpdatedCallback) => any;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
