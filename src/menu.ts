import { app, BrowserWindow, Menu, MenuItem } from "electron";
import path from "node:path";
import fs from "fs/promises";
import enUS from './i18n/locales/en-US.json'
import zhCN from './i18n/locales/zh-CN.json'
import { Config } from "./types";

type MessageSchema = typeof zhCN
const messages: Record<string, MessageSchema> = {
  'en-US': enUS,
  'zh-CN': zhCN,
}

// 创建一个通用的翻译函数
export const createTranslator = async () => {
  const configPath = await path.join(app.getPath("userData"), "app-config.json");
  const raw = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(raw) as Config
  return (key: string) => {
    const keys = key.split('.')
    let result: any = messages[config.language as "en-US" | "zh-CN"]
    for (const k of keys) {
      result = result[k]
    }
    return result as string
  }
}

export const createMenu = async (mainWindow: BrowserWindow) => {
  const t = await createTranslator()
  const menu = new Menu();
  menu.append(new MenuItem({
    label: app.name,
    submenu: [
      {
        label: t("home.newChat"),
        accelerator: "CmdOrCtrl+N",
        click: () => {
          mainWindow.webContents.send("new-conversation");
        },
      },
      {
        label: t("settings.title"),
        accelerator: "CmdOrCtrl+,",
        click: () => {
          mainWindow.webContents.send("open-settings");
        },
      },
      {
        type: "separator",
      },
      {
        role: "quit",
        accelerator: "CmdOrCtrl+Q",
      },
    ],
  }));
  menu.append(new MenuItem({
    role: "editMenu"
  }));
  menu.append(new MenuItem({
    role: "viewMenu"
  }));
  menu.append(new MenuItem({
    role: "windowMenu"
  }));
  menu.append(new MenuItem({
    role: "help"
  }));
  Menu.setApplicationMenu(menu);
};

// 导出一个更新菜单的函数，在语言改变时调用
export const updateMenu = async (mainWindow: BrowserWindow) => {
  await createMenu(mainWindow);
}
