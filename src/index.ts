import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Basic MCP Server",
  version: "1.0.0",
});

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

server.registerTool(
  "math/calc",
  {
    title: "Math Calculation",
    description: "Performs basic arithmetic operations.",
    inputSchema: {
      operation: z
        .enum(["add", "subtract", "multiply", "divide"])
        .describe("Arithmetic operation (add, subtract, multiply, divide)"),
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
    },
  },
  async ({ operation, a, b }) => {
    let result: number;

    switch (operation) {
      case "add":
        result = a + b;
        break;
      case "subtract":
        result = a - b;
        break;
      case "multiply":
        result = a * b;
        break;
      case "divide":
        if (b === 0) {
          return {
            content: [
              {
                type: "text",
                text: "Error: Division by zero is not allowed.",
              },
            ],
          };
        }
        result = a / b;
        break;
      default:
        return {
          content: [
            {
              type: "text",
              text: "Error: Unknown operation.",
            },
          ],
        };
    }

    return {
      content: [
        {
          type: "text",
          text: `Result: ${result}`,
        },
      ],
    };
  },
);

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
