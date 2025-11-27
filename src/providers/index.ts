import type { ProviderConfigMap } from "../types";
import { BaseProvider } from "./BaseProvider";
import { OpenAIProvider } from "./OpenAIProvider";
import { QianfanProvider } from "./QianfanProvider";

export const createProvider = (
  providerName: string,
  providerConfigs: ProviderConfigMap = {}
): BaseProvider => {
  const config = providerConfigs[providerName] ?? {};
  switch (providerName) {
    case "qianfan":
      return new QianfanProvider(
        config["access-key"] || "",
        config["secret-key"] || ""
      );
    case "dashscope":
      return new OpenAIProvider(
        config["api-key"] || "",
        config["base-url"] || ""
      );
    case "deepseek":
      return new OpenAIProvider(
        config["api-key"] || "",
        config["base-url"] || ""
      );
    default:
      throw new Error(`Unsupported provideer: ${providerName}`);
  }
};
