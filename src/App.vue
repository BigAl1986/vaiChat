<template>
  <div class="flex items-center justify-between h-screen">
    <div
      class="w-[300px] bg-gray-200 h-full border-r border-gray-300 flex flex-col"
    >
      <ConversationList
        :items="conversationsStore.items"
        class="flex-1 overflow-y-auto"
      />
      <div class="grid grid-cols-2 gap-2 p-2">
        <router-link to="/" class="w-full">
          <Button color="green" icon-name="radix-icons:chat-bubble">{{
            $t("home.newChat")
          }}</Button>
        </router-link>
        <router-link to="/settings" class="w-full">
          <Button color="green" plain icon-name="radix-icons:gear">{{
            $t("settings.title")
          }}</Button>
        </router-link>
      </div>
    </div>
    <div class="h-full flex-1">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import ConversationList from "./components/ConversationList.vue";
import Button from "./components/Button.vue";
import { onMounted } from "vue";
import { initProviders } from "./db";
import { useConversationsStore } from "./store/conversations";
import { useI18n } from "vue-i18n";
import { watch } from "vue";
import { useRouter } from "vue-router";

const conversationsStore = useConversationsStore();
const { locale } = useI18n();
const router = useRouter();

function applyThemeColor(color: string) {
  document.documentElement.style.setProperty("--theme-color", color);
  // 计算 hover 颜色（稍微变暗）
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const hoverR = Math.max(0, Math.floor(r * 0.9));
  const hoverG = Math.max(0, Math.floor(g * 0.9));
  const hoverB = Math.max(0, Math.floor(b * 0.9));
  const hoverColor = `#${hoverR.toString(16).padStart(2, "0")}${hoverG.toString(16).padStart(2, "0")}${hoverB.toString(16).padStart(2, "0")}`;
  document.documentElement.style.setProperty("--theme-color-hover", hoverColor);
  // 计算浅色背景（用于 plain 按钮）
  const lightR = Math.min(255, Math.floor(r + (255 - r) * 0.9));
  const lightG = Math.min(255, Math.floor(g + (255 - g) * 0.9));
  const lightB = Math.min(255, Math.floor(b + (255 - b) * 0.9));
  const lightColor = `rgb(${lightR}, ${lightG}, ${lightB})`;
  document.documentElement.style.setProperty("--theme-color-light", lightColor);
  // 计算文字颜色（根据亮度决定使用白色还是深色）
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const textColor = brightness > 128 ? "#1f2937" : "#ffffff";
  document.documentElement.style.setProperty("--theme-text-color", textColor);
}

onMounted(async () => {
  await initProviders();
  conversationsStore.fetchConversations();
  const cfg = await window.appConfig.get();
  locale.value = cfg.language ?? locale.value;
  // 加载并应用主题色
  if (cfg.themeColor) {
    applyThemeColor(cfg.themeColor);
  }
  window.menu.onNewConversation(() => {
    router.push("/");
  });
  window.menu.onOpenSettings(() => {
    router.push("/settings");
  });
});

// 监听 i18n locale 变化，同时更新文档语言属性
watch(locale, (newLocale) => {
  document.documentElement.lang = newLocale;
  document.documentElement.setAttribute("lang", newLocale);
});

// 初始化时设置文档语言
document.documentElement.lang = locale.value;
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
