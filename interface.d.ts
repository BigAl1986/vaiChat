import {
  Config,
  ConfigKey,
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
      get: () => Promise<Config>;
      getKey: (k: ConfigKey) => Promise<Config[keyof Config]>;
      set: (k: ConfigKey, v: Config[keyof Config]) => Promise<Config>;
    };
    electronI18n: {
      getLocale(): Promise<string>;
    };
  }
}
