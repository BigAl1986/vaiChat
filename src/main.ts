import { app, BrowserWindow, ipcMain, net, protocol } from "electron";
import path from "node:path";
import fs from "fs/promises";
import started from "electron-squirrel-startup";
import "dotenv/config";
import type { Config, CreateChatProps } from "./types";
import { createProvider } from "./providers";
import i18n from "./i18n";

if (started) {
  app.quit();
}

const defaultConfig: Config = {
  language: "zh-CN",
  fontSize: 14,
  providerConfigs: {},
};

async function getConfigPath(): Promise<string> {
  return path.join(app.getPath("userData"), "app-config.json");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  );
}

async function loadConfig(): Promise<Config> {
  try {
    const configPath = await getConfigPath();
    const raw = await fs.readFile(configPath, "utf8");
    return { ...defaultConfig, ...(JSON.parse(raw) as Partial<Config>) };
  } catch (e: unknown) {
    // 如果文件不存在，则写入默认配置并返回默认值
    if (
      isNodeError(e) &&
      (e.code === "ENOENT" || e.code === "ENOTDIR")
    ) {
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
  ipcMain.handle("i18n/getLocale", (event) => {
    void event;
    return i18n.global.locale.valueOf();
  });
  ipcMain.handle("i18n/t", (event, key: string) => {
    void event;
    return i18n.global.t(key);
  });

  ipcMain.handle("config/get", async () => await loadConfig());
  ipcMain.handle("config/getKey", async (event, key: keyof Config) => {
    void event;
    const cfg = await loadConfig();
    return cfg[key];
  });
  ipcMain.handle(
    "config/set",
    async (event, key: keyof Config, value: Config[keyof Config]) => {
      void event;
      const cfg = await loadConfig();
      const updatedCfg = { ...cfg, [key]: value } as Config;
      await saveConfig(updatedCfg);
      return updatedCfg;
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

  const emitChatError = (messageId: number, error: unknown) => {
    const baseMessage =
      error instanceof Error
        ? error.message || "未知错误"
        : typeof error === "string"
          ? error
          : "未知错误";
    const hint = "请前往系统设置 → 模型中填写对应配置后重试。";
    const message = baseMessage ? `${baseMessage}\n\n${hint}` : hint;
    mainWindow.webContents.send("update-message", {
      messageId,
      data: {
        is_end: true,
        result: message,
        error: true,
      },
    });
  };

  ipcMain.on("start-chat", async (_event, data: CreateChatProps) => {
    const { providerName, messages, messageId, selectedModel } = data;

    try {
      const cfg = await loadConfig();
      const provider = createProvider(providerName, cfg.providerConfigs);
      const stream = await provider.chat(messages, selectedModel);
      for await (const chunk of stream) {
        mainWindow.webContents.send("update-message", {
          messageId,
          data: chunk,
        });
      }
    } catch (error) {
      emitChatError(messageId, error);
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
