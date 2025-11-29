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

export type MessageStatus = "loading" | "streaming" | "finished" | "error";

export interface MessageProps extends BaseProps {
  content: string;
  type: "question" | "answer";
  conversationId: number;
  status?: MessageStatus;
  imagePath?: string;
  isError?: boolean;
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

export interface CommonChunkProp extends BaiduChunkProp {
  error?: boolean;
}

export interface UpdateMessageProp {
  messageId: number;
  data: {
    is_end: boolean;
    result: string;
    error?: boolean;
  };
}

export type OnUpdateMessageCallback = (data: UpdateMessageProp) => void;

export interface HTMLDivInstance {
  ref: HTMLDivElement;
}

export type ProviderConfigMap = Record<string, Record<string, string>>;

export type Config = {
  language: string;
  fontSize: number;
  providerConfigs: ProviderConfigMap;
  themeColor?: string;
};

export type ConfigKey = "language" | "fontSize" | "providerConfigs" | "themeColor";

export interface SaveImagePayload {
  name: string;
  buffer: ArrayBuffer;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    appConfig: {
      get: () => Promise<Config>;
      getKey: (k: ConfigKey) => Promise<Config[keyof Config]>;
      set: (k: ConfigKey, v: Config[keyof Config]) => Promise<Config>;
    };
    electronI18n: {
      getLocale(): Promise<string>;
    };
  }
}

export interface IElectronAPI {
  startChat: (data: CreateChatProps) => void;
  onUpdatedMessage: (callback: OnUpdateMessageCallback) => any;
  saveImageToUserDir: (image: SaveImagePayload) => Promise<string>;
}

