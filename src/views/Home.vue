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

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ProviderSelect from "../components/ProviderSelect.vue";
import MessageInput from "../components/MessageInput.vue";
import { ProviderProps } from "../types";
import { db } from "../db";
import { useConversationsStore } from "../store/conversations";

const router = useRouter();
const store = useConversationsStore();

const selectedModel = ref("");
const modelInfo = computed(() => {
  const [providerId, model] = selectedModel.value.split("/");
  return { providerId, model };
});
const providers = ref<ProviderProps[]>([]);

onMounted(async () => {
  providers.value = await db.providers.toArray();
});

async function persistImageToUserDir(image?: File) {
  if (!image) return undefined;
  try {
    const buffer = await image.arrayBuffer();
    return await window.electronAPI.saveImageToUserDir({
      name: image.name,
      buffer,
    });
  } catch (error) {
    console.error("save image error", error);
    return undefined;
  }
}

const createConversation = async (question: string, image?: File) => {
  const { providerId, model } = modelInfo.value;
  const currentDate = new Date().toISOString();
  const copiedImagePath = await persistImageToUserDir(image);
  const conversationId = await store.createConversation({
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
  store.setActiveConversationId(conversationId);
  router.push(`/conversations/${conversationId}?init=${newMessageId}`);
};
</script>

<style scoped></style>
