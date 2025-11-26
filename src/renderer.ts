/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite'
);

import { createApp } from "vue";
import { createI18n, useI18n } from "vue-i18n";
import App from "./App.vue";
import zh from "./i18n/locales/zh-CN.json";
import en from "./i18n/locales/en-US.json";
import {
  createMemoryHistory,
  createRouter,
  RouteLocationNormalizedGeneric,
  RouteRecordRaw,
} from "vue-router";
import Home from "./views/Home.vue";
import Conversations from "./views/Conversations.vue";
import Settings from "./views/Settings.vue";
import { createPinia } from "pinia";
import { useConversationsStore } from "./store/conversations";
import "highlight.js/styles/github-dark-dimmed.min.css";
import i18n from "./i18n";

const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/conversations/:id", component: Conversations },
  { path: "/settings", component: Settings },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
router.beforeEach((to: RouteLocationNormalizedGeneric) => {
  const store = useConversationsStore();
  if (!to.path.startsWith("/conversations/")) store.setActiveConversationId(-1);
});
const store = createPinia();

const app = createApp(App);

// 应用启动后从主进程同步语言配置
async function initLocale() {
  try {
    const appLocale = (await window.electronI18n.getLocale()) as
      | "zh-CN"
      | "en-US";
    i18n.global.locale = appLocale;
  } catch (e) {
    console.error("init locale error", e);
  }
}

app.use(router);
app.use(i18n);
app.use(store);

initLocale().then(() => {
  app.mount("#app");
});
