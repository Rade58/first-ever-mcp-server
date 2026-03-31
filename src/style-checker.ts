import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync } from "node:fs";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseStyleMarkdownPath = path.join(
  __dirname,
  "../js-standard-styles/RULES.md",
);
const baseStyleMarkdown = readFileSync(baseStyleMarkdownPath, "utf-8");

import { z } from "zod";

const server = new McpServer({
  name: "code-review-server",
  version: "1.0.0",
});

server.registerPrompt(
  "review-code",
  {
    title: "Style Checker",
    description: "Review code for best practices and potential issues",
    argsSchema: {
      code: z.string(),
    },
  },
  ({ code }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please review this code to se if it follows our best practices.
            Use this JavaScript Standard Style guide as a reference:
            \n\n ===============\n\n ${baseStyleMarkdown} \n\n =================\n\n 
            \n for our code: \n\n ===========\n\n  ${code} \n\n`,
          },
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
