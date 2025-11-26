import {
  CreateChatProps,
  OnUpdateMessageCallback,
  OnUpdateDestPathCallback,
} from "src/types";

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void;
  onUpdatedMessage: (callback: OnUpdateMessageCallback) => any;
  copyImageToUserDir: (imagePath: string) => Promise<string>;
  saveImageToUserDir: (image: File) => void;
  onUpdatedDestPast: (callback: OnUpdateDestPathCallback) => any;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    appConfig: {
      get: () => Promise<{ language: string; fontSize: number }>;
      getKey: (k: "language" | "fontSize") => Promise<string | number>;
      set: (k: "language" | "fontSize", v: string | number) => Promise<any>;
    };
    electronI18n: {
      getLocale(): Promise<string>;
    };
  }
}
