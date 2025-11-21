<template>
  <div
    class="h-[10%] bg-gray-200 border-b border-t border-gray-300 flex items-center justify-between px-3"
  >
    <h3 class="font-semibold text-gray-900">
      {{ currentConversation?.title }}
    </h3>
    <span class="text-sm text-gray-500">{{
      dayjs(currentConversation?.createdAt).format("YYYY-MM-DD")
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
import { ConversationProps, MessageProps, UpdateMessageProp } from "src/types";
import { onMounted, ref, watch } from "vue";
import { db } from "../db";
import dayjs from "dayjs";

const route = useRoute();
let conversationId = parseInt(route.params.id as string);
const initMessageId = parseInt(route.query.init as string);
const filteredMessages = ref<MessageProps[]>([]);
const currentConversation = ref<ConversationProps | undefined>(undefined);

const setData = async (conversationId: number) => {
  filteredMessages.value = await db.messages
    .where({ conversationId })
    .sortBy("createdAt");
  currentConversation.value = await db.conversations
    .where({ id: conversationId })
    .first();
};

const createAnswer = async () => {
  const answer: Omit<MessageProps, "id"> = {
    content: "",
    type: "answer",
    conversationId,
    status: "loading",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const newMessageId = await db.messages.add(answer);
  filteredMessages.value.push({ ...answer, id: newMessageId });

  if (currentConversation.value) {
    const provider = await db.providers
      .where({ id: currentConversation.value.providerId })
      .first();
    const lastQuestion = await db.messages
      .where({ conversationId: currentConversation.value.id, type: "question" })
      .last();

    if (provider) {
      await window.electronAPI.startChat({
        messageId: newMessageId,
        providerName: provider.name,
        selectedModel: currentConversation.value.selectedModel,
        content: lastQuestion?.content || "",
      });
    }
  }
};

onMounted(async () => {
  setData(conversationId);
  if (initMessageId) {
    await createAnswer();
  }
  window.electronAPI.onUpdatedMessage(async (streamData: UpdateMessageProp) => {
    const { messageId, data } = streamData;
    const currentMessage = await db.messages.where({ id: messageId }).first();
    if (currentMessage) {
      const updatedData: Partial<MessageProps> = {
        content: currentMessage.content + data.result,
        status: data.is_end ? "finished" : "streaming",
        updatedAt: new Date().toISOString(),
      };
      await db.messages.update(messageId, updatedData);
      const index = filteredMessages.value.findIndex(
        (message) => message.id === messageId
      );
      if (index !== -1) {
        filteredMessages.value[index] = {
          ...filteredMessages.value[index],
          ...updatedData,
        };
      }
    }
  });
});

watch(
  () => route.params.id,
  (newId) => {
    conversationId = parseInt(newId as string);
    setData(conversationId);
  }
);
</script>

<style scoped></style>
