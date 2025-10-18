import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { supabase } from "@/app/supabase";
import { NextRequest } from "next/server";
import {
  StdlibModuleInputSchema,
  StdlibModuleOutputSchema,
} from "@/types/stdlib-module.types";
import { stdlib } from "@/utils/docs/stdlib";
import { aikenCodePrompt } from "@/utils/prompts/prompts";
// Authentication helper
async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  console.log("[MCP] Auth header present:", !!authHeader);

  if (!authHeader) {
    console.log("[MCP] No auth header, returning 401");
    return null;
  }

  const token = authHeader.split(" ")[1];
  console.log("[MCP] Token extracted:", token ? "present" : "missing");

  if (!token) {
    console.log("[MCP] No token, returning 401");
    return null;
  }

  try {
    console.log("[MCP] Looking up access token in database");
    const { data: accessToken } = await supabase
      .from("access_tokens")
      .select("*")
      .eq("token", token)
      .single();

    console.log("[MCP] Access token found:", !!accessToken);

    if (!accessToken) {
      console.log("[MCP] No access token found, returning 401");
      return null;
    }

    console.log("[MCP] Token expires at:", accessToken.expires_at);
    console.log("[MCP] Current time:", new Date());

    if (new Date(accessToken.expires_at) < new Date()) {
      console.log("[MCP] Token expired, returning 401");
      return null;
    }

    console.log("[MCP] Authentication successful");
    return accessToken;
  } catch (e) {
    console.error("[MCP] Error validating token:", e);
    return null;
  }
}

// MCP handler with authentication
const handler = async (req: Request) => {
  // Inject authentication here
  const nextReq = req as unknown as NextRequest; // for type compatibility
  const accessToken = await authenticateRequest(nextReq);
  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Log request body
  const requestBody = await req
    .clone()
    .json()
    .catch(() => null);
  console.log("[MCP] Request body:", requestBody);

  return createMcpHandler(
    (server) => {
      server.registerPrompt(
        "aikenCode",
        {
          title: "Aiken Code",
          description: "Generate Aiken code Generation Intructions/Steps",
          argsSchema: { query: z.string() },
        },
        ({ query }) => ({
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: aikenCodePrompt(query),
              },
            },
          ],
        })
      );

      // LANGUAGE TOUR DOCS
      server.registerTool(
        "languageTour",

        {
          title: "Aiken Brief Language Tour",
          description: "Return brief metadata about Aiken docs and syntax",
        },
        async () => {
          let output = "";
          try {
            const response = await fetch(
              `https://raw.githubusercontent.com/aiken-lang/site/refs/heads/main/src/pages/language-tour.mdx`
            );
            if (response.ok) {
              output = await response.text();
            } else {
              return {
                content: [
                  {
                    type: "text",
                    text: `Failed to fetch Aiken Meta Docs: ${response.status} ${response.statusText}`,
                  },
                ],
              };
            }
          } catch (error: any) {
            return {
              content: [
                { type: "text", text: `Exception occurred: ${error.message}` },
              ],
            };
          }
          return {
            content: [{ type: "text", text: output }],
          };
        }
      );

      // STDLIB COMPACT DOCS
      server.registerTool(
        "stdlib",
        {
          title: "Aiken Standard Library",
          description: "Functions and types for Standard Lib",
        },
        async () => {
          // Validate the stdlib data against the Zod schema
          const docs = stdlib;

          return {
            content: [{ type: "text", text: JSON.stringify(docs) }],
          };
        }
      );

      // STDLIB DETAILED DOCS
      server.registerTool(
        "stdlib-module",
        {
          title: "Aiken Stdlib Module Implementation",
          description:
            "Fetch the complete source code implementation for a specific Aiken stdlib module. Returns implementation code.",
          inputSchema: StdlibModuleInputSchema.shape,
          outputSchema: StdlibModuleOutputSchema.shape,
        },
        async ({ module }) => {
          const filePath = `${module}.ak`;
          const githubUrl = `https://raw.githubusercontent.com/aiken-lang/stdlib/refs/tags/2.2.0/lib/${filePath}`;

          try {
            const response = await fetch(githubUrl);

            if (!response.ok) {
              return {
                content: [
                  {
                    type: "text",
                    text: `Failed to fetch module '${module}': ${response.status} ${response.statusText}\nURL: ${githubUrl}`,
                  },
                ],
              };
            }

            const sourceCode = await response.text();

            // Validate output against schema
            const output = StdlibModuleOutputSchema.parse({
              module,
              sourceCode,
            });

            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(output),
                },
              ],
              structuredContent: output,
            };
          } catch (error: any) {
            return {
              content: [
                {
                  type: "text",
                  text: `Exception occurred while fetching module '${module}': ${error.message}`,
                },
              ],
            };
          }
        }
      );
    },
    {
      // Optionally add server capabilities here
    },
    {
      basePath: "/",
      verboseLogs: true,
      redisUrl: process.env.REDIS_URL,
    }
  )(req);
};

export { handler as GET, handler as POST };

// CORS preflight handler
export async function OPTIONS() {
  const response = new Response(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}
