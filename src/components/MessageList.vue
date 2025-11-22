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
            {{ message.content }}
          </div>
          <div
            class="message-question bg-gray-200 text-gray-700 p-2 rounded-md"
            v-else
          >
            <template v-if="message.status === 'loading'">
              <Icon icon="eos-icons:three-dots-loading" class="mr-2 w-5 h-5" />
            </template>
            <template v-else>
              {{ message.content }}
            </template>
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
import { nextTick, onMounted, ref, watch } from "vue";

const props = defineProps<{ messages: MessageProps[] }>();
const wrapRef = ref<HTMLDivElement>();
watch(
  () => props.messages,
  () => {
    nextTick(() => {
      wrapRef.value?.scrollTo({
        top: wrapRef.value.scrollHeight,
        behavior: "smooth",
      });
    });
  }
);
onMounted(() => wrapRef.value?.scrollTo(0, wrapRef.value.scrollHeight));
</script>

<style scoped></style>
