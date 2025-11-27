import type {
  Config,
  ConfigKey,
  CreateChatProps,
  OnUpdateMessageCallback,
  SaveImagePayload,
} from "./src/types";

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void;
  onUpdatedMessage: (callback: OnUpdateMessageCallback) => any;
  saveImageToUserDir: (image: SaveImagePayload) => Promise<string>;
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
