<template>
  <div
    class="message-input border border-gray-300 rounded-lg mb-2 w-full focus-within:outline-green-700 p-1"
  >
    <div v-if="!!imagePreview">
      <img
        :src="imagePreview"
        alt="preview"
        class="h-24 w-24 object-cover rounded"
      />
    </div>
    <div class="flex items-center">
      <input
        type="file"
        accept="image/"
        class="hidden"
        ref="uploadRef"
        @change="handleUpload"
      />
      <Icon
        icon="radix-icons:image"
        width="24"
        height="24"
        :class="disabled ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'"
        @click="handleTriggerUpload"
      />
      <input
        type="text"
        v-model="currentValue"
        :disabled="disabled"
        class="flex-1 outline-0 h-10 pl-1"
      />
      <Button
        color="green"
        icon-name="radix-icons:paper-plane"
        :disabled="buttonDisabled"
        @click="onCreate"
      >
        发送
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "./Button.vue";
import { Icon } from "@iconify/vue";

const emit = defineEmits<{ create: [value: string] }>();
const props = defineProps<{ disabled?: boolean }>();
const currentValue = defineModel<string>("");

const uploadRef = ref<HTMLInputElement | null>(null);
const imagePreview = ref("");
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
const handleTriggerUpload = () => {
  if (props.disabled) return;
  uploadRef.value?.click();
};
const handleUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const selectedImage = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target?.result);

      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(selectedImage);
  }
};
</script>

<style scoped></style>
