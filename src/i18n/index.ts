import { createI18n } from "vue-i18n";
import zh from "./locales/zh-CN.json";
import en from "./locales/en-US.json";

export type MessageSchema = typeof zh;

const i18n = createI18n<{ message: MessageSchema }, "zh-CN" | "en-US">({
  legacy: false,
  locale: "zh-CN",
  fallbackLocale: "zh-CN",
  messages: {
    "zh-CN": zh,
    "en-US": en,
  },
});

export default i18n;
