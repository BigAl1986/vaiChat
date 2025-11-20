<template>
  <div
    class="message-input border border-gray-300 rounded-lg w-full mb-2 flex items-center relative"
  >
    <input
      type="text"
      v-model="currentValue"
      class="flex-1 outline-green-700 w-full h-10 pl-2"
    />
    <Button
      color="green"
      icon-name="radix-icons:paper-plane"
      class="absolute right-1"
      @click="onCreate"
    >
      发送
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from "./Button.vue";

const emit = defineEmits<{ create: [value: string] }>();
const currentValue = defineModel<string>();
const onCreate = () => {
  if (currentValue.value && currentValue.value.trim() !== "") {
    emit("create", currentValue.value);
  }
};
</script>

<style scoped></style>
