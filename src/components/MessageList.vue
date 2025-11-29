<template>
  <div class="message-list h-full overflow-y-auto" ref="wrapRef">
    <div
      class="message-item mb-3"
      v-for="message in messages"
      :key="message.id"
    >
      <div class="flex" :class="{ 'justify-end': message.type === 'question' }">
        <div>
          <div
            class="message-time text-sm text-gray-500 mb-2"
            :class="{ 'text-right': message.type === 'question' }"
          >
            {{ dayjs(message.createdAt).format("YYYY-MM-DD") }}
          </div>
          <div
            class="message-answer p-2 rounded-md"
            v-if="message.type === 'question'"
          >
            <img
              v-if="!!message.imagePath"
              :src="`safe-file://${message.imagePath}`"
              alt="message image"
              class="h-24 w-24 object-cover rounded block"
            />
            {{ message.content }}
          </div>
          <div
            class="message-question p-2 rounded-md"
            :class="messageQuestionClass(message)"
            v-else
          >
            <template v-if="message.status === 'loading' && !message.isError">
              <Icon icon="eos-icons:three-dots-loading" class="mr-2 w-5 h-5" />
            </template>
            <div v-else-if="message.isError" class="message-error">
              <Icon icon="solar:danger-triangle-bold" class="w-4 h-4" />
              <span class="ml-2">{{ message.content }}</span>
            </div>
            <div
              class="prose prose-slate prose-headings:my-2 prose-li:my-0 prose-ul:my-1 prose-p:my-0 prose-pre:p-0 prose-hr:my-1"
              v-else
            >
              <VueMarkdown :source="message.content" :plugins="plugins" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import dayjs from "dayjs";
import { MessageProps } from "../types";
import { ref } from "vue";
import VueMarkdown from "vue-markdown-render";
import markdownItHighlightjs from "markdown-it-highlightjs";

const plugins = [markdownItHighlightjs];
defineProps<{ messages: MessageProps[] }>();
const wrapRef = ref<HTMLDivElement>();

const messageQuestionClass = (message: MessageProps) => {
  if (message.isError) {
    return "bg-red-50 text-red-600 border border-red-200";
  }
  return "bg-gray-200 text-gray-700";
};

defineExpose({
  ref: wrapRef,
});
</script>

<style scoped>
.message-answer {
  background-color: var(--theme-color, #16a34a);
  color: var(--theme-text-color, #ffffff);
}
.message-error {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1.4;
}
</style>
