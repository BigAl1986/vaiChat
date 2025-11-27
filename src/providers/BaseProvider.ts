import { ChatMessage, CommonChunkProp } from "../types";

export abstract class BaseProvider {
  abstract chat(
    messages: ChatMessage[],
    model: string
  ): Promise<AsyncIterable<CommonChunkProp>>;
  protected abstract transformResponse(chunk: any): CommonChunkProp;
}
