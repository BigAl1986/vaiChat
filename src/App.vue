<template>
  <div class="flex items-center justify-between h-screen">
    <div
      class="w-[300px] bg-gray-200 h-full border-r border-gray-300 flex flex-col"
    >
      <ConversationList :items="conversations" class="flex-1 overflow-y-auto" />
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
    <div class="h-full flex-1 flex flex-col items-center">
      <div class="w-[80%] flex-1 flex justify-center flex-col">
        <ProviderSelect :items="providers" v-model="selectedModel" />
      </div>
      <div class="w-[80%]">
        <MessageInput v-model="inputValue" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import ConversationList from "./components/ConversationList.vue";
import { ConversationProps, ProviderProps } from "./types";
import ProviderSelect from "./components/ProviderSelect.vue";
import { ref } from "vue";
import MessageInput from "./components/MessageInput.vue";

const selectedModel = ref("");
const inputValue = ref("");

const conversations: ConversationProps[] = [
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

const providers: ProviderProps[] = [
  {
    id: 1,
    name: "qianfan",
    title: "百度千帆",
    desc: "文心一言 百度出品的大模型",
    models: ["ERNIE-4.0-8K", "ERNIE-3.5-8K", "ERNIE-Speed-128K"],
    avatar:
      "https://aip-static.cdn.bcebos.com/landing/product/ernie-bote321e5.png",
    createdAt: "2024-07-03",
    updatedAt: "2024-07-03",
  },
  {
    id: 2,
    name: "dashscope",
    title: "阿里灵积",
    desc: "通义千问",
    // https://help.aliyun.com/zh/dashscope/developer-reference/api-details?spm=a2c4g.11186623.0.0.5bf41507xgULX5#b148acc634pfc
    models: ["qwen-turbo", "qwen-plus", "qwen-max", "qwen-vl-plus"],
    avatar:
      "https://qph.cf2.poecdn.net/main-thumb-pb-4160791-200-qlqunomdvkyitpedtghnhsgjlutapgfl.jpeg",
    createdAt: "2024-07-03",
    updatedAt: "2024-07-03",
  },
  {
    id: 3,
    name: "deepseek",
    title: "DeepSeek",
    desc: "DeepSeek",
    // https://api-docs.deepseek.com/zh-cn/
    models: ["deepseek-chat"],
    avatar:
      "https://qph.cf2.poecdn.net/main-thumb-pb-4981273-200-phhqenmywlkiybehuaqvsxpfekviajex.jpeg",
    createdAt: "2024-12-27",
    updatedAt: "2024-12-27",
  },
];
</script>
