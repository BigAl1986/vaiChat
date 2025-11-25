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
    <MessageList :messages="filteredMessages" ref="messageListRef" />
    <MessageInput
      v-model="inputValue"
      @create="sendNewMessage"
      :disabled="messagesStore.isStreamingMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import MessageInput from "../components/MessageInput.vue";
import MessageList from "../components/MessageList.vue";
import {
  ChatMessage,
  HTMLDivInstance,
  MessageProps,
  UpdateMessageProp,
} from "src/types";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { db } from "../db";
import dayjs from "dayjs";
import { useConversationsStore } from "../store/conversations";
import { useMessagesStore } from "../store/messages";

const route = useRoute();
const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();
let conversationId = ref(parseInt(route.params.id as string));
const initMessageId = parseInt(route.query.init as string);
const filteredMessages = computed(() => messagesStore.items);
const inputValue = ref("");
const messageListRef = ref<HTMLDivInstance>();
const sendedMessages = computed((): ChatMessage[] =>
  messagesStore.items
    .filter((message) => message.status !== "loading")
    .map((message) => {
      return {
        role: message.type === "question" ? "user" : "assistant",
        content: message.content,
        ...(message.imagePath && { imagePath: message.imagePath }),
      };
    })
);
const currentConversation = computed(() =>
  conversationsStore.getConversationById(conversationId.value)
);
let copiedImagePath: string | undefined;

const sendNewMessage = async (question: string, imagePath?: string) => {
  if (imagePath) {
    try {
      copiedImagePath = await window.electronAPI.copyImageToUserDir(imagePath);
      // window.electronAPI.saveImageToUserDir(image);
    } catch (error) {
      console.error(error);
    }
  }
  if (question) {
    const date = new Date().toISOString();
    await messagesStore.createMessage({
      content: question,
      conversationId: conversationId.value,
      type: "question",
      createdAt: date,
      updatedAt: date,
      ...(copiedImagePath && { imagePath: copiedImagePath }),
    });

    inputValue.value = "";
    createAnswer();
  }
};

const createAnswer = async () => {
  const date = new Date().toISOString();
  const answer: Omit<MessageProps, "id"> = {
    content: "",
    type: "answer",
    conversationId: conversationId.value,
    status: "loading",
    createdAt: date,
    updatedAt: date,
  };
  const newMessageId = await messagesStore.createMessage(answer);
  await scrollToEnd();

  if (currentConversation.value) {
    const provider = await db.providers
      .where({ id: currentConversation.value.providerId })
      .first();

    if (provider) {
      window.electronAPI.startChat({
        messageId: newMessageId,
        providerName: provider.name,
        selectedModel: currentConversation.value.selectedModel,
        messages: sendedMessages.value,
      });
    }
  }
};
const scrollToEnd = async () => {
  await nextTick();
  if (messageListRef.value) {
    messageListRef.value.ref.scrollTo({
      top: messageListRef.value.ref.scrollHeight,
      behavior: "smooth",
    });
  }
};

onMounted(async () => {
  await messagesStore.getMessagesByConversationId(conversationId.value);
  await scrollToEnd();
  if (initMessageId) {
    await createAnswer();
  }
  let messageListHeight = 0;
  window.electronAPI.onUpdatedMessage(async (streamData: UpdateMessageProp) => {
    messagesStore.updateMessage(streamData);
    await nextTick();
    const newHeight = messageListRef.value?.ref.scrollHeight;
    if (newHeight && newHeight > messageListHeight) {
      messageListHeight = newHeight;
      await scrollToEnd();
    }
  });
});

watch(
  () => route.params.id,
  async (newId) => {
    conversationId.value = parseInt(newId as string);
    await messagesStore.getMessagesByConversationId(conversationId.value);
    await scrollToEnd();
  }
);
</script>

<style scoped></style>
