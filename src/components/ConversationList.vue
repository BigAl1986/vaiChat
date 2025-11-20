import { ConversationProps } from '../types';
<template>
  <div class="conversation-list">
    <router-link
      v-for="item in items"
      :key="item.id"
      :to="`/conversations/${item.id}`"
    >
      <div
        class="item border-gray-300 border-t cursor-pointer bg-white hover:bg-gray-100 p-2"
      >
        <a href="#">
          <div
            class="flex justify-between items-center text-sm leading-5 text-gray-500"
          >
            <span>{{ item.selectedModel }}</span>
            <span>{{ item.updatedAt }}</span>
          </div>
          <h2 class="font-semibold leading-6 text-gray-900 truncate">
            {{ item.title }}
          </h2>
        </a>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ConversationProps } from "src/types";

defineProps<{ items: ConversationProps[] }>();
</script>

<style scoped></style>
