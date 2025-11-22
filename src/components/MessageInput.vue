<template>
  <div
    class="message-input border border-gray-300 rounded-lg w-full mb-2 flex items-center relative"
  >
    <input
      type="text"
      v-model="currentValue"
      :disabled="disabled"
      class="flex-1 outline-green-700 w-full h-10 pl-2"
    />
    <Button
      color="green"
      icon-name="radix-icons:paper-plane"
      class="absolute right-1"
      :disabled="buttonDisabled"
      @click="onCreate"
    >
      发送
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Button from "./Button.vue";

const emit = defineEmits<{ create: [value: string] }>();
const props = defineProps<{ disabled?: boolean }>();
const currentValue = defineModel<string>("");

const buttonDisabled = computed(
  () =>
    props.disabled ||
    currentValue.value?.trim() === "" ||
    currentValue.value?.trim() === undefined
);
const onCreate = () => {
  if (currentValue.value && currentValue.value.trim() !== "") {
    emit("create", currentValue.value);
    currentValue.value = "";
  }
};
</script>

<style scoped></style>
