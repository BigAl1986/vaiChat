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

const conversationsStore = useConversationsStore();
const { locale } = useI18n();

onMounted(async () => {
  await initProviders();
  conversationsStore.fetchConversations();
  const cfg = await window.appConfig.get();
  locale.value = cfg.language ?? locale.value;
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
