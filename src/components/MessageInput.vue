<template>
  <div
    class="message-input border border-gray-300 rounded-lg mb-2 w-full p-1"
  >
    <div v-if="!!imagePreview">
      <img
        :src="imagePreview"
        :alt="t('components.messageInput.previewAlt')"
        class="h-24 w-24 object-cover rounded"
      />
    </div>
    <div class="flex items-center">
      <input
        type="file"
        accept="image/*"
        class="hidden"
        ref="uploadRef"
        @change="handleUpload"
        :aria-label="t('components.messageInput.uploadAria')"
      />
      <Icon
        icon="radix-icons:image"
        width="24"
        height="24"
        :title="t('components.messageInput.uploadTitle')"
        :class="disabled ? ' cursor-not-allowed opacity-50' : ' cursor-pointer'"
        @click="handleTriggerUpload"
      />
      <input
        type="text"
        v-model="currentValue"
        :disabled="disabled"
        class="flex-1 outline-0 pl-1"
        :placeholder="t('components.messageInput.placeholder')"
        :aria-label="t('components.messageInput.inputAria')"
      />
      <Button
        color="green"
        icon-name="radix-icons:paper-plane"
        :disabled="buttonDisabled"
        @click="onCreate"
        :aria-label="t('components.messageInput.sendAria')"
      >
        {{ t("conversations.send") }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "./Button.vue";
import { Icon } from "@iconify/vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const emit = defineEmits<{
  create: [value: string, image: File | undefined];
}>();
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
    emit("create", currentValue.value, selectedImage);
    currentValue.value = "";
    imagePreview.value = "";
    selectedImage = undefined;
    if (uploadRef.value) {
      uploadRef.value.value = "";
    }
  }
};
const handleTriggerUpload = () => {
  if (props.disabled) return;
  uploadRef.value?.click();
};
// let selectedImage: File | null = null;
let selectedImage: File | undefined = undefined;
const handleUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedImage = target.files[0];
    imagePreview.value = window.URL.createObjectURL(selectedImage);
  }
};
</script>

<style scoped>
.message-input:focus-within {
  outline: 2px solid var(--theme-color, #16a34a);
  outline-offset: -2px;
}
</style>
