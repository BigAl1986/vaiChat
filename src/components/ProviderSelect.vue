<template>
  <div class="provider-select">
    <SelectRoot>
      <SelectTrigger>
        <SelectValue placeholder="select a model ..." />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectViewport>
            <SelectItem value="apple">
              <SelectItemText>apple</SelectItemText>
            </SelectItem>
            <SelectItem value="banana">
              <SelectItemText>banana</SelectItemText>
            </SelectItem>
            <SelectItem value="orange">
              <SelectItemText>orange</SelectItemText>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>

<script setup lang="ts">
import {
  SelectRoot,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
} from "radix-vue";
</script>

<style scoped></style>
