<template>
  <div class="flex flex-col items-center h-full">
    <div class="w-[80%] flex-1 flex justify-center flex-col">
      <ProviderSelect :items="providers" v-model="selectedModel" />
    </div>
    <div class="w-[80%]">
      <MessageInput
        @create="createConversation"
        :disabled="selectedModel === ''"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ProviderSelect from "../components/ProviderSelect.vue";
import MessageInput from "../components/MessageInput.vue";
import { ProviderProps } from "src/types";
import { db } from "../db";
import { useRouter } from "vue-router";
import { useConversationsStore } from "../store/conversations";

const selectedModel = ref("");
const modelInfo = computed(() => {
  const [providerId, model] = selectedModel.value.split("/");
  return { providerId, model };
});
const providers = ref<ProviderProps[]>([]);
const router = useRouter();
const conversationsStore = useConversationsStore();
let copiedImagePath: string | undefined;

onMounted(async () => {
  providers.value = await db.providers.toArray();
  window.electronAPI.onUpdatedDestPast(async (destPath: string) => {
    console.log("destPath===", destPath);

    copiedImagePath = destPath;
  });
});

const createConversation = async (question: string, imagePath?: string) => {
  const { providerId, model } = modelInfo.value;
  const currentDate = new Date().toISOString();
  if (imagePath) {
    try {
      copiedImagePath = await window.electronAPI.copyImageToUserDir(imagePath);
      // window.electronAPI.saveImageToUserDir(image);
    } catch (error) {
      console.error(error);
    }
  }
  const conversationId = await conversationsStore.createConversation({
    title: question,
    providerId: parseInt(providerId),
    selectedModel: model,
    createdAt: currentDate,
    updatedAt: currentDate,
  });
  const newMessageId = await db.messages.add({
    content: question,
    conversationId,
    type: "question",
    createdAt: currentDate,
    updatedAt: currentDate,
    ...(copiedImagePath && { imagePath: copiedImagePath }),
  });
  conversationsStore.setActiveConversationId(conversationId);
  router.push(`/conversations/${conversationId}?init=${newMessageId}`);
};
</script>

<style scoped></style>
