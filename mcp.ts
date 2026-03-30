import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { z } from "zod";

// todo
// 1
// create an mcp server
// 2
// add an additional tool
// 3
// start receiving messages on stdin and sending messages on stdout

// 1
const server = new McpServer({
  name: "add-server",
  version: "1.0.0",
});

// for health checking
// throw new Error("what is going on!");

// 2
server.registerTool(
  "add",
  {
    title: "Addition Tool",
    description: "Adds two numbers together.",
    inputSchema: {
      a: z.number(),
      b: z.number(),
    },
  },

  async ({ a, b }) => {
    return {
      content: [{ type: "text", text: String(a + b) }],
    };
  },
);

// 3
const transport = new StdioServerTransport();
await server.connect(transport);
