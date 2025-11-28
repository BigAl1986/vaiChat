<template>
  <div class="conversation-list">
    <router-link
      v-for="item in items"
      :key="item.id"
      :to="`/conversations/${item.id}`"
      @click="store.setActiveConversationId(item.id)"
      @contextmenu.prevent="showContextMenu(item.id)"
    >
      <div
        class="item border-gray-300 border-t cursor-pointer hover:bg-gray-100 p-2"
        :class="{
          ' bg-gray-300': item.id === store.activeConversationId,
          'bg-white': item.id !== store.activeConversationId,
        }"
      >
        <a href="#">
          <div
            class="flex justify-between items-center text-sm leading-5 text-gray-500"
          >
            <span>{{ item.selectedModel }}</span>
            <span>{{ dayjs(item.updatedAt).format("YYYY-MM-DD") }}</span>
          </div>
          <h2
            class="font-semibold leading-6 truncate"
            :class="{
              'text-blue-400': item.id === store.activeConversationId,
              'text-gray-900': item.id !== store.activeConversationId,
            }"
          >
            {{ item.title }}
          </h2>
        </a>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useConversationsStore } from "../store/conversations";
import { ConversationProps } from "../types";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

defineProps<{ items: ConversationProps[] }>();
const store = useConversationsStore();
const router = useRouter();
const showContextMenu = (id: number) => {
  window.menu.showContextMenu(id);
};
onMounted(() => {
  window.menu.onDeleteConversation((id) => {
    store.deleteConversation(id);
    if (store.activeConversationId === id) {
      store.setActiveConversationId(-1);
    }
    if (router.currentRoute.value.path === `/conversations/${id}`) {
      router.push("/");
    }
  });
});
</script>
