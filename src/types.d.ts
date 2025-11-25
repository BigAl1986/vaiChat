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
  imagePath?: string;
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  imagePath?: string;
};

export interface CreateChatProps {
  messages: ChatMessage[];
  providerName: string;
  selectedModel: string;
  messageId: number;
}

export interface BaiduChunkProp {
  is_end: boolean;
  result: string;
}

export interface CommonChunkProp extends BaiduChunkProp {}

export interface UpdateMessageProp {
  messageId: number;
  data: {
    is_end: boolean;
    result: string;
  };
}

export type OnUpdateMessageCallback = (data: UpdateMessageProp) => void;

export type OnUpdateDestPathCallback = (data: string) => void;

export interface HTMLDivInstance {
  ref: HTMLDivElement;
}
