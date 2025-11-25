import { ChatCompletion } from "@baiducloud/qianfan";
import { BaseProvider } from "./BaseProvider";
import { BaiduChunkProp, ChatMessage, CommonChunkProp } from "src/types";

export class QianfanProvider extends BaseProvider {
  private client: any;
  constructor(accessKey: string, secretKey: string) {
    super();
    this.client = new ChatCompletion({
      QIANFAN_ACCESS_KEY: accessKey,
      QIANFAN_SECRET_KEY: secretKey,
      ENABLE_OAUTH: true,
    });
  }

  async chat(messages: ChatMessage[], model: string): Promise<any> {
    const stream = await this.client.chat(
      {
        messages,
        stream: true,
      },
      model
    );
    const self = this;
    return {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          yield self.transformResponse(chunk);
        }
      },
    };
  }

  protected transformResponse(chunk: BaiduChunkProp): CommonChunkProp {
    return chunk;
  }
}
