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
            class="message-answer bg-green-700 text-white p-2 rounded-md"
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
            class="message-question bg-gray-200 text-gray-700 p-2 rounded-md"
            v-else
          >
            <template v-if="message.status === 'loading'">
              <Icon icon="eos-icons:three-dots-loading" class="mr-2 w-5 h-5" />
            </template>
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
import { MessageProps } from "src/types";
import { ref } from "vue";
import VueMarkdown from "vue-markdown-render";
import markdownItHighlightjs from "markdown-it-highlightjs";

const plugins = [markdownItHighlightjs];
defineProps<{ messages: MessageProps[] }>();
const wrapRef = ref<HTMLDivElement>();

defineExpose({
  ref: wrapRef,
});
</script>

<style scoped></style>
