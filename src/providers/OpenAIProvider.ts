import OpenAI from "openai";
import { BaseProvider } from "./BaseProvider";
import type { ChatMessage, CommonChunkProp } from "../types";
import { convertMessages } from "../utils/helper";

export class OpenAIProvider extends BaseProvider {
  private client: OpenAI;
  constructor(apiKey: string, baseURL: string) {
    super();
    this.client = new OpenAI({ apiKey, baseURL });
  }

  async chat(messages: ChatMessage[], model: string): Promise<any> {
    const convertedMessages = await convertMessages(messages);
    const stream = await this.client.chat.completions.create({
      model,
      messages: convertedMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      stream: true,
    });
    const self = this as any;
    return {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          yield self.transformResponse(chunk);
        }
      },
    };
  }

  protected transformResponse(
    chunk: OpenAI.Chat.Completions.ChatCompletionChunk
  ): CommonChunkProp {
    const choice = chunk.choices[0];
    return {
      is_end: choice.finish_reason === "stop",
      result: choice.delta.content || "",
    };
  }
}
