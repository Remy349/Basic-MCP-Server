import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "Basic MCP Server",
  version: "1.0.0",
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("MCP Server is running...");
}

main().catch((err) => {
  console.error("Error starting MCP Server:", err);
  process.exit(1);
});
