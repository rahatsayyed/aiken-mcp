import { createMcpHandler } from "mcp-handler";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";

const handler = async (req: NextRequest) => {
  // Fetch authorization token from the request headers
  const authorization = (await headers()).get("authorization");
  if (!authorization) {
    // TODO: OAuth 2.1
    return new Response("Unauthorized", { status: 401 });
  }
  // TODO: Add token validation

  // Create the MCP handler
  return createMcpHandler(
    (server) => {
      // TODO: ADD TOOLS based on authorization
    },
    {},
    {
      basePath: "/api",
      maxDuration: 60,
      verboseLogs: true,
    }
  )(req);
};

export { handler as GET, handler as POST };

// TEST USAGE
// npx mcp-remote http://localhost:3000/api/mcp --header "Authorization: Bearer $AUTH_TOKEN"
