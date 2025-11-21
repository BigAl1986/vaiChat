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
    <MessageInput v-model="inputValue" @create="sendNewMessage" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import MessageInput from "../components/MessageInput.vue";
import MessageList from "../components/MessageList.vue";
import { ChatMessage, MessageProps, UpdateMessageProp } from "src/types";
import { computed, onMounted, ref, watch } from "vue";
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
const sendedMessages = computed((): ChatMessage[] =>
  messagesStore.items
    .filter((message) => message.status !== "loading")
    .map((message) => {
      return {
        role: message.type === "question" ? "user" : "assistant",
        content: message.content,
      };
    })
);
const currentConversation = computed(() =>
  conversationsStore.getConversationById(conversationId.value)
);

const sendNewMessage = async (question: string) => {
  if (question) {
    const date = new Date().toISOString();
    await messagesStore.createMessage({
      content: question,
      conversationId: conversationId.value,
      type: "question",
      createdAt: date,
      updatedAt: date,
    });
    inputValue.value = "";
    createAnswer();
  }
};

const createAnswer = async () => {
  const answer: Omit<MessageProps, "id"> = {
    content: "",
    type: "answer",
    conversationId: conversationId.value,
    status: "loading",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const newMessageId = await messagesStore.createMessage(answer);

  if (currentConversation.value) {
    const provider = await db.providers
      .where({ id: currentConversation.value.providerId })
      .first();
    const lastQuestion = await messagesStore.getLastQuestionByConversationId(
      conversationId.value
    );

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

onMounted(async () => {
  messagesStore.getMessagesByConversationId(conversationId.value);
  if (initMessageId) {
    await createAnswer();
  }
  window.electronAPI.onUpdatedMessage(async (streamData: UpdateMessageProp) => {
    messagesStore.updateMessage(streamData);
  });
});

watch(
  () => route.params.id,
  (newId) => {
    conversationId.value = parseInt(newId as string);
    messagesStore.getMessagesByConversationId(conversationId.value);
  }
);
</script>

<style scoped></style>
