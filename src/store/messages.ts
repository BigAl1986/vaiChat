import { defineStore } from "pinia";
import { db } from "../db";
import { MessageProps, UpdateMessageProp } from "../types";

export interface MessagesStore {
  items: MessageProps[];
}

export const useMessagesStore = defineStore("messages", {
  state: (): MessagesStore => {
    return {
      items: [],
    };
  },
  actions: {
    async getMessagesByConversationId(conversationId: number) {
      const items = await db.messages.where({ conversationId }).toArray();
      this.items = items;
    },
    async createMessage(answer: Omit<MessageProps, "id">) {
      const newMessageId = await db.messages.add(answer);
      this.items.push({ ...answer, id: newMessageId });
      return newMessageId;
    },
    async updateMessage(streamData: UpdateMessageProp) {
      const { messageId, data } = streamData;
      const currentMessage = this.items.find((item) => item.id === messageId);
      if (currentMessage) {
        const updatedData: Partial<MessageProps> = {
          content: currentMessage.content + data.result,
          status: data.is_end ? "finished" : "streaming",
          updatedAt: new Date().toISOString(),
        };
        await db.messages.update(messageId, updatedData);
        const index = this.items.findIndex(
          (message) => message.id === messageId
        );
        if (index !== -1) {
          this.items[index] = {
            ...this.items[index],
            ...updatedData,
          };
        }
      }
    },
  },
  getters: {
    getLastQuestionByConversationId: (state) => (id: number) => {
      return state.items.findLast(
        (item) => item.conversationId === id && item.type === "question"
      );
    },
  },
});
