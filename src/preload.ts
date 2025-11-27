// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import type {
  CreateChatProps,
  OnUpdateMessageCallback,
  Config,
  ConfigKey,
  SaveImagePayload,
} from "./types";

contextBridge.exposeInMainWorld("electronAPI", {
  startChat: (data: CreateChatProps) => ipcRenderer.send("start-chat", data),
  onUpdatedMessage: (callback: OnUpdateMessageCallback) =>
    ipcRenderer.on("update-message", (event, data) => callback(data)),
  saveImageToUserDir: (image: SaveImagePayload): Promise<string> =>
    ipcRenderer.invoke("save-image-to-user-dir", image),
});

contextBridge.exposeInMainWorld("appConfig", {
  get: (): Promise<Config> =>
    ipcRenderer.invoke("config/get") as Promise<Config>,
  getKey: (k: ConfigKey): Promise<Config[keyof Config]> =>
    ipcRenderer.invoke("config/getKey", k) as Promise<Config[keyof Config]>,
  set: (k: ConfigKey, v: Config[keyof Config]): Promise<Config> =>
    ipcRenderer.invoke("config/set", k, v) as Promise<Config>,
});

contextBridge.exposeInMainWorld("electronI18n", {
  getLocale: (): Promise<string> =>
    ipcRenderer.invoke("i18n/getLocale") as Promise<string>,
  t: (key: string): Promise<string> =>
    ipcRenderer.invoke("i18n/t", key) as Promise<string>,
});
