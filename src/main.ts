import { app, BrowserWindow, ipcMain, net, protocol } from "electron";
import path from "node:path";
import fs from "fs/promises";
import started from "electron-squirrel-startup";
import "dotenv/config";
import { Config, CreateChatProps } from "./types";
import { createProvider } from "./providers";
import i18n from "./i18n";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const defaultConfig: Config = { language: "zh-CN", fontSize: 14 };

async function getConfigPath(): Promise<string> {
  return path.join(app.getPath("userData"), "app-config.json");
}

async function loadConfig(): Promise<Config> {
  try {
    const configPath = await getConfigPath();
    const raw = await fs.readFile(configPath, "utf8");
    return { ...defaultConfig, ...(JSON.parse(raw) as Partial<Config>) };
  } catch (e: any) {
    // 如果文件不存在，则写入默认配置并返回默认值
    if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) {
      try {
        const configPath = await getConfigPath();
        await fs.writeFile(
          configPath,
          JSON.stringify(defaultConfig, null, 2),
          "utf8"
        );
      } catch (writeErr) {
        console.error("write default config error", writeErr);
      }
      return { ...defaultConfig };
    }
    console.error("loadConfig error", e);
    return { ...defaultConfig };
  }
}

async function saveConfig(cfg: Config): Promise<boolean> {
  try {
    const configPath = await getConfigPath();
    await fs.writeFile(configPath, JSON.stringify(cfg, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("saveConfig error", e);
    return false;
  }
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 暴露 i18n 接口给渲染进程
  ipcMain.handle("i18n/getLocale", (_ev) => i18n.global.locale.valueOf());
  ipcMain.handle("i18n/t", (_ev, key: string) => i18n.global.t(key));

  ipcMain.handle("config/get", async () => await loadConfig());
  ipcMain.handle("config/getKey", async (_ev, key: keyof Config) => {
    const cfg = await loadConfig();
    return cfg[key];
  });
  ipcMain.handle(
    "config/set",
    async (_ev, key: keyof Config, value: string | number) => {
      const cfg = await loadConfig();
      // @ts-ignore
      cfg[key] = value as any;
      await saveConfig(cfg);
      return cfg;
    }
  );

  protocol.handle("safe-file", async (req) => {
    const filePath = req.url.slice(5);
    return net.fetch(filePath);
  });

  ipcMain.handle("copy-image-to-user-dir", async (event, imagePath: string) => {
    console.log("imagePath===", imagePath);
    const userDataPath = app.getPath("userData");
    const imagesDir = path.join(userDataPath, "images");
    await fs.mkdir(imagesDir, { recursive: true });
    const fileName = path.basename(imagePath);
    const destPath = path.join(imagesDir, fileName);
    await fs.copyFile(imagePath, destPath);
    return destPath;
  });

  ipcMain.on("save-image-to-user-dir", async (event, image: File) => {
    console.log("image===", image);

    const userDataPath = app.getPath("userData");
    const imagesDir = path.join(userDataPath, "images");
    await fs.mkdir(imagesDir, { recursive: true });
    const fileName = image.name;
    const destPath = path.join(imagesDir, fileName);
    await fs.writeFile(destPath, image.stream());

    mainWindow.webContents.send("update-destPath", destPath);
  });

  ipcMain.on("start-chat", async (event, data: CreateChatProps) => {
    const { providerName, messages, messageId, selectedModel } = data;

    const provider = createProvider(providerName);
    const stream = await provider.chat(messages, selectedModel);
    for await (const data of stream) {
      mainWindow.webContents.send("update-message", {
        messageId,
        data,
      });
    }
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
