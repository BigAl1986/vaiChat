import { defineStore } from "pinia";
import { db } from "../db";
import { ConversationProps } from "../types";

export interface ConversationsStore {
  items: ConversationProps[];
  activeConversationId: number;
}

export const useConversationsStore = defineStore("conversations", {
  state: (): ConversationsStore => {
    return {
      items: [],
      activeConversationId: -1,
    };
  },
  actions: {
    async fetchConversations() {
      const items = await db.conversations.toArray();
      this.items = items;
    },
    async createConversation(row: Omit<ConversationProps, "id">) {
      const newConversationId = await db.conversations.add(row);
      this.items.push({
        ...row,
        id: newConversationId,
      });
      return newConversationId;
    },
    setActiveConversationId(id: number) {
      this.activeConversationId = id;
    },
    async deleteConversation(id: number) {
      await db.conversations.delete(id);
      this.items = this.items.filter((item) => item.id !== id);
    },
  },
  getters: {
    getConversationById: (state) => (id: number) => {
      return state.items.find((item) => item.id === id);
    },
  },
});
