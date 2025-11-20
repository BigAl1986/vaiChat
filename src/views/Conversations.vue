<template>
  <div
    class="h-[10%] bg-gray-200 border-b border-t border-gray-300 flex items-center justify-between px-3"
  >
    <h3 class="font-semibold text-gray-900">
      {{ currentConversation?.title }}
    </h3>
    <span class="text-sm text-gray-500">{{
      currentConversation?.createdAt
    }}</span>
  </div>
  <div class="conversations w-[85%] h-[90%] mx-auto flex flex-col">
    <MessageList :messages="filteredMessages" />
    <MessageInput />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import MessageInput from "../components/MessageInput.vue";
import MessageList from "../components/MessageList.vue";
import { ConversationProps, MessageProps } from "src/types";
import { ref, watch } from "vue";
import { conversations, messages } from "../utils/testData";

const route = useRoute();
let conversationId = parseInt(route.params.id as string);
const filteredMessages = ref<MessageProps[]>([]);
filteredMessages.value = messages.filter(
  (message) => message.conversationId === conversationId
);
const currentConversation = ref<ConversationProps | undefined>(undefined);
currentConversation.value = conversations.find(
  (conversation) => conversation.id === conversationId
);

watch(
  () => route.params.id,
  (newId) => {
    conversationId = parseInt(newId as string);
    filteredMessages.value = messages.filter(
      (message) => message.conversationId === conversationId
    );
    currentConversation.value = conversations.find(
      (conversation) => conversation.id === conversationId
    );
  }
);
</script>

<style scoped></style>
