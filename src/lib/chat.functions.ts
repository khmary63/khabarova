import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system", "tool"]),
  content: z.string(),
  tool_call_id: z.string().optional(),
  tool_calls: z.array(z.any()).optional(),
  name: z.string().optional(),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

export const aiChat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const { runAiChat } = await import("./chat.server");
    return runAiChat(data.messages);
  });
