<template>
  <div class="message-list h-full overflow-y-auto">
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
            {{ message.createdAt }}
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
import { MessageProps } from "src/types";

defineProps<{ messages: MessageProps[] }>();
</script>

<style scoped></style>
