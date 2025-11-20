<template>
  <div class="flex items-center justify-between h-screen">
    <div
      class="w-[300px] bg-gray-200 h-full border-r border-gray-300 flex flex-col"
    >
      <ConversationList :items="conversations" class="flex-1 overflow-y-auto" />
      <div class="grid grid-cols-2 gap-2 p-2">
        <router-link to="/" class="w-full">
          <Button color="green" icon-name="radix-icons:chat-bubble"
            >新建聊天</Button
          >
        </router-link>
        <router-link to="/settings" class="w-full">
          <Button color="green" plain icon-name="radix-icons:chat-bubble"
            >应用设置</Button
          >
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
import { onMounted, ref } from "vue";
import { db, initProviders } from "./db";
import { ConversationProps } from "./types";

const conversations = ref<ConversationProps[]>([]);
onMounted(async () => {
  await initProviders();
  conversations.value = await db.conversations.toArray();
});
</script>
