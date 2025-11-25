// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import {
  CreateChatProps,
  OnUpdateMessageCallback,
  OnUpdateDestPathCallback,
} from "./types";

contextBridge.exposeInMainWorld("electronAPI", {
  startChat: (data: CreateChatProps) => ipcRenderer.send("start-chat", data),
  onUpdatedMessage: (callback: OnUpdateMessageCallback) =>
    ipcRenderer.on("update-message", (event, data) => callback(data)),
  copyImageToUserDir: (imagePath: string) =>
    ipcRenderer.invoke("copy-image-to-user-dir", imagePath),
  saveImageToUserDir: (image: File) =>
    ipcRenderer.send("save-image-to-user-dir", image),
  onUpdatedDestPast: (callback: OnUpdateDestPathCallback) =>
    ipcRenderer.on("update-destPath", (event, data) => callback(data)),
});
