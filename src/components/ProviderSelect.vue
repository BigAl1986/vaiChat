<template>
  <div class="provider-select">
    <SelectRoot v-model="currentValue">
      <SelectTrigger
        class="flex w-full items-center justify-between rounded-md py-1.5 px-3 shadow-md border outline-none data-placeholder:text-gray-400"
      >
        <SelectValue placeholder="select a model ..." />
        <Icon icon="radix-icons:chevron-down" class="h-5 w-5" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent class="bg-white rounded-md shadow-md z-100 border">
          <SelectViewport class="p-2">
            <div v-for="item in items" :key="item.id">
              <SelectLabel class="flex items-center px-6 h-7 text-gray-500">
                <img
                  :src="item.avatar"
                  :alt="item.name"
                  class="h-5 w-5 mr-2 rounded"
                />
                {{ item.name }}
              </SelectLabel>
              <SelectGroup>
                <SelectItem
                  class="provider-select-item outline-none rounded flex items-center h-7 px-6 relative cursor-pointer"
                  v-for="(model, index) in item.models"
                  :key="index"
                  :value="`${item.id}/${model}`"
                >
                  <SelectItemIndicator>
                    <Icon
                      icon="radix-icons:check"
                      class="absolute left-1 top-2 w-6"
                    />
                  </SelectItemIndicator>
                  <SelectItemText>{{ model }}</SelectItemText>
                </SelectItem>
                <SelectSeparator class="h-px my-2 bg-gray-300" />
              </SelectGroup>
            </div>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  SelectRoot,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectGroup,
  SelectItemIndicator,
  SelectSeparator,
} from "radix-vue";
import { ProviderProps } from "../types";

defineProps<{ items: ProviderProps[] }>();
const currentValue = defineModel<string>();
</script>

<style scoped>
.provider-select-item {
  color: var(--theme-color, #16a34a);
}

.provider-select-item[data-highlighted] {
  background-color: var(--theme-color, #16a34a);
  color: var(--theme-text-color, #ffffff);
}
</style>
