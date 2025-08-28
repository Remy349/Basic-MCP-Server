import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Basic MCP Server",
  version: "1.0.0",
});

// ===> Echo MCP <===
server.registerTool(
  "echo",
  {
    title: "Echo",
    description: "Repeat the input text exactly as provided.",
    inputSchema: {
      text: z.string().min(1).max(100).describe("Text to echo back"),
    },
  },
  async ({ text }) => {
    return {
      content: [
        {
          type: "text",
          text: text,
        },
      ],
    };
  },
);

// ===> Clock MCP <===
server.registerTool(
  "clock/now",
  {
    title: "Get current date and time",
    description: "Returns the current date and time in ISO 8601 format.",
    inputSchema: {},
  },
  async () => {
    const now = new Date();

    return {
      content: [
        {
          type: "text",
          text: `ISO: ${now.toISOString()}\nLocal: ${now.toLocaleString()}\nEpoch(ms): ${now.getTime()}`,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("MCP Server is running...");
}

main().catch((err) => {
  console.error("Error starting MCP Server:", err);
  process.exit(1);
});
