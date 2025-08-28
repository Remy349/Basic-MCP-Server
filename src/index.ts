import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "Basic MCP Server",
  version: "1.0.0",
});

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
