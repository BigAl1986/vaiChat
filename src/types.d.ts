import { messages } from "./utils/testData";
interface BaseProps {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationProps extends BaseProps {
  title: string;
  selectedModel: string;
  providerId: number;
}

export interface ProviderProps extends BaseProps {
  name: string;
  models: string[];
  title?: string;
  desc?: string;
  avatar?: string;
}

export type MessageStatus = "loading" | "streaming" | "finished";

export interface MessageProps extends BaseProps {
  content: string;
  type: "question" | "answer";
  conversationId: number;
  status?: MessageStatus;
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface CreateChatProps {
  messages: ChatMessage[];
  providerName: string;
  selectedModel: string;
  messageId: number;
}

export interface UpdateMessageProp {
  messageId: number;
  data: {
    is_end: boolean;
    result: string;
  };
}

export type OnUpdatedCallback = (data: UpdateMessageProp) => void;
