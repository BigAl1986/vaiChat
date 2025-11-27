import fs from "fs/promises";
import { lookup } from "mime-types";
import { ChatMessage } from "../types";

type MessageContent =
  | { type: "text"; text: string }
  | { type: "input_image"; image_url: { url: string } };

export async function convertMessages(messages: ChatMessage[]) {
  const convertedMessages = [];
  for (const message of messages) {
    const contentParts: MessageContent[] = [];
    const trimmedText = message.content?.trim();
    if (trimmedText) {
      contentParts.push({ type: "text", text: trimmedText });
    }

    if (message.imagePath) {
      const imageBuffer = await fs.readFile(message.imagePath);
      const base64Image = imageBuffer.toString("base64");
      const mimeType = lookup(message.imagePath);
      contentParts.push({
        type: "input_image",
        image_url: { url: `data:${mimeType};base64,${base64Image}` },
      });
    }

    const { imagePath: removedImagePath, ...messageWithoutImagePath } = message;
    void removedImagePath;
    convertedMessages.push({
      ...messageWithoutImagePath,
      content:
        contentParts.length > 0
          ? contentParts
          : [{ type: "text", text: "" }],
    });
  }
  return convertedMessages;
}
