<template>
  <div
    class="message-input border border-gray-300 rounded-lg w-full mb-2 flex items-center relative"
  >
    <input
      type="text"
      v-model="currentValue"
      class="flex-1 outline-green-700 w-full h-10 pl-2"
    />
    <button
      class="px-5 py-1 rounded-sm bg-green-700 hover:bg-green-600 text-white flex items-center absolute right-1 h-8"
    >
      <Icon icon="radix-icons:paper-plane" class="mr-2" />
      发送
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const currentValue = defineModel<string>();
</script>

<style scoped></style>
