<template>
  <div class="flex items-center justify-between h-screen">
    <div
      class="w-[300px] bg-gray-200 h-full border-r border-gray-300 flex flex-col"
    >
      <ConversationList :items="items" class="flex-1 overflow-y-auto" />
      <div class="grid grid-cols-2 gap-2 p-2">
        <button
          class="shadow-sm inline-flex items-center justify-center bg-green-700 text-white hover:bg-green-700/90 border border-green-700 hover:text-white h-8 py-2 px-[15px] text-sm rounded-sm"
        >
          <Icon icon="radix-icons:chat-bubble" class="mr-2" />
          新建聊天
        </button>
        <button
          class="shadow-sm inline-flex items-center justify-center bg-green-50 text-green-700 hover:bg-green-700 border border-green-700 hover:text-white h-8 py-2 px-[15px] text-sm rounded-sm"
        >
          <Icon icon="radix-icons:gear" class="mr-2" />
          应用设置
        </button>
      </div>
    </div>
    <div class="h-full flex-1">
      <ProviderSelect />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import ConversationList from "./components/ConversationList.vue";
import { ConversationProps } from "./types";
import ProviderSelect from "./components/ProviderSelect.vue";

const items: ConversationProps[] = [
  {
    id: 1,
    selectedModel: "GPT-3.5-Turbo",
    title: "你好你好你好",
    createdAt: "2024-07-03",
    updatedAt: "2025-11-19",
    providerId: 1,
  },
  {
    id: 2,
    selectedModel: "GPT-3.5-Turbo",
    title: "中午好中午好",
    createdAt: "2024-07-03",
    updatedAt: "2025-11-19",
    providerId: 1,
  },
  {
    id: 3,
    selectedModel: "GPT-3.5-Turbo",
    title: "晚上好晚上好晚上好晚上好晚上好晚上好晚上好晚上好晚上好晚上好",
    createdAt: "2024-07-03",
    updatedAt: "2025-11-19",
    providerId: 1,
  },
  {
    id: 4,
    selectedModel: "GPT-3.5-Turbo",
    title: "早上好早上好",
    createdAt: "2024-07-03",
    updatedAt: "2025-11-19",
    providerId: 1,
  },
];
</script>
