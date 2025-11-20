<template>
  <div class="flex flex-col items-center h-full">
    <div class="w-[80%] flex-1 flex justify-center flex-col">
      <ProviderSelect :items="providers" v-model="selectedModel" />
    </div>
    <div class="w-[80%]">
      <MessageInput v-model="inputValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProviderSelect from "../components/ProviderSelect.vue";
import MessageInput from "../components/MessageInput.vue";
import { providers } from "../utils/testData";

const selectedModel = ref("");
const inputValue = ref("");
</script>

<style scoped></style>
